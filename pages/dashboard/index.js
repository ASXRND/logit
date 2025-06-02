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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Для мобильного меню
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
      loadNotes(currentPage);
    }
  };

  const deleteNote = async (id) => {
    try {
      console.log('Deleting note with id:', id);
      const res = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.log('Server error:', errorData);
      }
      setNotes(prev => prev.filter(note => note.id !== id));
      if (filteredNotes.length <= 1 && currentPage > 1) {
        loadNotes(currentPage - 1);
      } else {
        loadNotes(currentPage);
      }
    } catch (err) {
      console.error('Delete error:', err);
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
    <div className="flex flex-col min-h-screen text-white md:flex-row">
      {/* Боковая панель */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white/10 backdrop-blur-md p-6 border-r border-white/10 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:transform-none md:static md:w-64 transition-transform duration-300 z-50`}>
        <button
          className="md:hidden absolute top-4 right-4 text-white"
          onClick={() => setIsSidebarOpen(false)}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">Панель</h2>
        <ul className="space-y-4 text-sm font-medium">
          <li className="hover:text-blue-400 transition cursor-pointer">Главная</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Профиль</li>
          <li className="hover:text-blue-400 transition cursor-pointer">Настройки</li>
        </ul>
      </aside>

      {/* Кнопка для открытия боковой панели на мобильных */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-white/10 p-2 rounded"
        onClick={() => setIsSidebarOpen(true)}
      >
        ☰
      </button>

      {/* Основной контент */}
      <main className="flex-1 p-4 md:p-8 bg-gradient-to-br from-[#0f0f1f] to-[#050510] overflow-auto">
        <h1 className="ml-8 md:ml-0 text-2xl md:text-3xl mb-6 font-bold">Мои заметки</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 text-red-300 rounded text-sm">
            {error}
            <button 
              onClick={() => setError(null)} 
              className="float-right font-bold"
            >
              ×
            </button>
          </div>
        )}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <input
            type="text"
            placeholder="Поиск заметок..."
            className="flex-1 p-2 bg-gray-900 text-white placeholder-white/70 rounded border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={() => loadNotes()}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded text-sm"
          >
            Обновить
          </button>
        </div>

        <NoteEditor onNoteAdded={addNote} onError={setError} />

        {isLoading ? (
          <div className="flex justify-center mt-4">
            <p>Загрузка данных...</p>
          </div>
        ) : (
          <>
            <NoteList 
              notes={filteredNotes} 
              onDelete={deleteNote}
              onError={setError}
              emptyMessage=""
            />
            
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                <button
                  onClick={() => loadNotes(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/10 disabled:opacity-50 rounded text-sm"
                >
                  Назад
                </button>
                <span className="px-4 py-2 text-sm">
                  Страница {currentPage} из {totalPages}
                </span>
                <button
                  onClick={() => loadNotes(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/10 disabled:opacity-50 rounded text-sm"
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