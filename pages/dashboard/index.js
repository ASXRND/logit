import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import NoteEditor from '../../components/NoteEditor';
import NoteList from '../../components/NoteList';
import debounce from 'lodash.debounce';

export default function DashboardPage() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const notesPerPage = 10;

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const loadNotes = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/notes?page=${page}&limit=${notesPerPage}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Ошибка загрузки заметок');
      
      const data = await res.json();
      setNotes(data.notes);
      setFilteredNotes(data.notes);
      setTotalPages(Math.ceil(data.totalCount / notesPerPage));
      setCurrentPage(page);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить заметки');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      loadNotes();
    }
  }, [status, loadNotes]);

  const handleSearch = debounce((term) => {
    if (term) {
      const filtered = notes.filter(note =>
        note.text.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, 300);

  useEffect(() => {
    handleSearch(searchTerm);
    return () => handleSearch.cancel();
  }, [searchTerm, notes, handleSearch]);

  const addNote = async (note) => {
    setNotes(prev => [note, ...prev]);
    if (currentPage !== 1) {
      setCurrentPage(1);
      loadNotes(1);
    } else {
      loadNotes(currentPage); // Перезагружаем текущую страницу
    }
  };

  const deleteNote = async (id) => {
    try {
      const res = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Ошибка при удалении заметки');
      }
      
      setNotes(prev => prev.filter(note => note.id !== id));
      if (filteredNotes.length <= 1 && currentPage > 1) {
        loadNotes(currentPage - 1);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Не удалось удалить заметку');
    }
  };

  const updateNote = async (id, newText) => {
    try {
      const res = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ text: newText }),
      });
      
      if (!res.ok) throw new Error('Ошибка при обновлении заметки');
      
      setNotes(prev => prev.map(note => 
        note.id === id ? { ...note, text: newText } : note
      ));
    } catch (err) {
      console.error(err);
      setError('Не удалось обновить заметку');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p>Загрузка...</p>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen text-white">
      <aside className="w-64 bg-white/10 backdrop-blur-md p-6 border-r border-white/10 sticky top-0 h-screen">
        <h2 className="text-2xl font-bold mb-6">Панель</h2>
        <ul className="space-y-4 text-sm font-medium">
          <li className="hover:text-blue-400 transition cursor-pointer">Главная</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Профиль</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Настройки</li>
        </ul>
      </aside>
      <main className="flex-1 p-8 bg-gradient-to-br from-[#0f0f1f] to-[#050510] overflow-auto">
        <h1 className="text-3xl mb-6 font-bold">Мои заметки</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}
        <div className="mb-6 flex gap-4">
          <input
            type="text"
            placeholder="Поиск заметок..."
            className="flex-1 p-2 bg-gray-900 text-white placeholder-white/70 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => loadNotes()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded transition"
          >
            Обновить
          </button>
        </div>

        <NoteEditor onNoteAdded={addNote} onError={setError} />

        {isLoading ? (
          <div className="flex justify-center mt-8">
            <p>Загрузка заметок...</p>
          </div>
        ) : (
          <>
            <NoteList 
              notes={filteredNotes} 
              onDelete={deleteNote}
              onUpdate={updateNote}
              emptyMessage="Заметок не найдено"
            />
            
            {totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                <button
                  onClick={() => loadNotes(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 disabled:opacity-50 rounded"
                >
                  Назад
                </button>
                <span className="px-4 py-2">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => loadNotes(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 disabled:opacity-50 rounded"
                >
                  Вперед
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}