import { Request, Response } from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const saveSegments = async (req: Request, res: Response) => {
  const { segments, upload_id } = req.body;

  if (!Array.isArray(segments)) {
    return res.status(400).send('Segments should be an array');
  }

  if (!upload_id) {
    return res.status(400).send('Upload ID is required');
  }

  try {
    const segmentPromises = segments.map(segment =>
      db.query<ResultSetHeader>('INSERT INTO segments (start, end, text, character_name) VALUES (?, ?, ?, ?)', [
        segment.start, segment.end, segment.text, segment.character_name,
      ])
    );

    const segmentResults = await Promise.all(segmentPromises);

    const rythmoBandPromises = segmentResults.map(result => 
      db.query<ResultSetHeader>('INSERT INTO rythmo_bands (segment_id, upload_id) VALUES (?, ?)', [
        result[0].insertId, upload_id
      ])
    );

    await Promise.all(rythmoBandPromises);
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

export const deleteSegment = async (req: Request, res: Response) => {
  const segmentId = req.params.id;

  try {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM segments WHERE segment_id = ?', [segmentId]);
    if (result.affectedRows > 0) {
      res.send('Segment deleted successfully');
    } else {
      res.status(404).send('Segment not found');
    }
  } catch (error) {
    console.error('Error deleting segment:', error);
    res.status(500).send('Error deleting segment');
  }
};
