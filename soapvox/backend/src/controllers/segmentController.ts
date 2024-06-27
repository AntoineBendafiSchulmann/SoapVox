import { Request, Response } from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const saveSegments = async (req: Request, res: Response) => {
  const { segments } = req.body;

  if (!Array.isArray(segments)) {
    return res.status(400).send('Segments should be an array');
  }

  try {
    await db.query('DELETE FROM segments');
    const promises = segments.map(segment =>
      db.query<ResultSetHeader>('INSERT INTO segments (start, end, text, character_name) VALUES (?, ?, ?, ?)', [
        segment.start, segment.end, segment.text, segment.character,
      ])
    );

    await Promise.all(promises);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving segments:', error);
    res.status(500).send('Error saving segments');
  }
};

export const getSegments = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM segments');
    res.json(rows);
  } catch (error) {
    console.error('Error loading segments:', error);
    res.status(500).send('Error loading segments');
  }
};

export const deleteSegments = async (req: Request, res: Response) => {
  try {
    await db.query<ResultSetHeader>('DELETE FROM segments');
    res.sendStatus(200);
  } catch (error) {
    console.error('Error deleting segments:', error);
    res.status(500).send('Error deleting segments');
  }
};
