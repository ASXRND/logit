import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function NoteList({ notes, onNotesUpdated }) {
  const [deletingId, setDeletingId] = useState(null);
  const { data: session } = useSession();

  const handleDelete = async (id) => {
    if (!session) return;
    
    setDeletingId(id);
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onNotesUpdated(id);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (notes.length === 0) {
    return <p className="text-white/70">Заметок пока нет</p>;
  }

  return (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="p-4 bg-white/10 rounded shadow flex justify-between items-start"
        >
          <div className="flex-1">
            <p className="text-white">{note.text}</p>
            <p className="text-xs text-white/50 mt-1">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(note.id)}
            disabled={deletingId === note.id}
            className={`ml-4 text-sm ${deletingId === note.id ? 'text-red-200' : 'text-red-400 hover:text-red-600'}`}
          >
            {deletingId === note.id ? 'Удаляем...' : 'Удалить'}
          </button>
        </li>
      ))}
    </ul>
  );
}