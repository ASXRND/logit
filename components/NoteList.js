import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function NoteList({ notes, onDelete, onError, emptyMessage }) {
  const [deletingId, setDeletingId] = useState(null);
  const { data: session } = useSession();

  const handleDelete = async (id) => {
    if (!session) return;

    setDeletingId(id);
    try {
      const response = await fetch(`/api/notes?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при удалении заметки');
      }

      onDelete(id);
    } catch (error) {
      console.error('Error deleting note:', error);
      onError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (!notes || notes.length === 0) {
    return <p className="text-white/70 text-sm">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-4">
      {notes.map((note) => (
        <li
          key={note.id}
          className="p-4 bg-white/10 rounded shadow flex flex-col sm:flex-row sm:items-start gap-2"
        >
          <div className="flex-1">
            <p className="text-white text-sm break-words">{note.text}</p>
            <p className="text-xs text-white/50 mt-1">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => handleDelete(note.id)}
            disabled={deletingId === note.id}
            className={`text-sm ${deletingId === note.id ? 'text-red-200' : 'text-red-400 hover:text-red-600'} sm:ml-4 w-full sm:w-auto text-left`}
          >
            {deletingId === note.id ? 'Удаляем...' : 'Удалить'}
          </button>
        </li>
      ))}
    </ul>
  );
}