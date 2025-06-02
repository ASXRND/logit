import Database from 'better-sqlite3';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const db = new Database('notes.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT NOT NULL,
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const userEmail = session.user.email;

  try {
    switch (req.method) {
      case 'GET': {
        const { page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;
        const userNotes = db.prepare(`
          SELECT id, text, created_at 
          FROM notes 
          WHERE user_email = ? 
          ORDER BY created_at DESC
          LIMIT ? OFFSET ?
        `).all(userEmail, parseInt(limit), parseInt(offset));

        const totalCount = db.prepare(`
          SELECT COUNT(*) as count 
          FROM notes 
          WHERE user_email = ?
        `).get(userEmail).count;

        return res.status(200).json({ notes: userNotes, totalCount });
      }

      case 'POST': {
        const { text } = req.body;

        if (typeof text !== 'string' || !text || text.trim() === '') {
          return res.status(400).json({ error: 'Text must be a non-empty string' });
        }

        const result = db.prepare(`
          INSERT INTO notes (user_email, text)
          VALUES (?, ?)
        `).run(userEmail, text.trim());

        const newNote = {
          id: result.lastInsertRowid.toString(),
          user: userEmail,
          text: text.trim(),
          created_at: new Date().toISOString(),
        };

        return res.status(201).json({ note: newNote });
      }

      case 'DELETE': {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ error: 'ID is required' });
        }

        const result = db.prepare(`
          DELETE FROM notes 
          WHERE id = ? AND user_email = ?
        `).run(parseInt(id), userEmail);

        if (result.changes === 0) {
          return res.status(404).json({ error: 'Заметка не найдена или не принадлежит пользователю' });
        }

        return res.status(200).json({ message: 'Заметка удалена' });
      }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}