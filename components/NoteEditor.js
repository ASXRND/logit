import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function NoteEditor({ onNoteAdded, onError }) {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || !session) return;

    setIsLoading(true);
    
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка при сохранении заметки');
      }

      const newNote = await response.json();
      console.log('Server response:', newNote);
      onNoteAdded(newNote.note);
      setText('');
    } catch (error) {
      console.error('Error saving note:', error);
      onError(error.message || 'Не удалось сохранить заметку');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        className="w-full p-3 rounded bg-gray-900 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        rows={4}
        placeholder="Введите заметку..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`mt-2 w-full sm:w-auto px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''} text-sm`}
        disabled={isLoading}
      >
        {isLoading ? 'Добавляем...' : 'Добавить заметку'}
      </button>
    </form>
  );
}