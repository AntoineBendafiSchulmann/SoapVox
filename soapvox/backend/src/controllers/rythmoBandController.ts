import { Request, Response } from 'express';
import { db } from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export const createRythmoBand = async (req: Request, res: Response) => {
  const { segment_id, upload_id } = req.body;

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO rythmo_bands (segment_id, upload_id) VALUES (?, ?)',
      [segment_id, upload_id]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error creating rythmo band:', error);
    res.status(500).send('Error creating rythmo band');
  }
};

export const getRythmoBands = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM rythmo_bands');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching rythmo bands:', error);
    res.status(500).send('Error fetching rythmo bands');
  }
};

export const deleteRythmoBand = async (req: Request, res: Response) => {
  const rythmoBandId = req.params.id;

  try {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM rythmo_bands WHERE rythmo_band_id = ?', [rythmoBandId]);
    if (result.affectedRows > 0) {
      res.send('Rythmo band deleted successfully');
    } else {
      res.status(404).send('Rythmo band not found');
    }
  } catch (error) {
    console.error('Error deleting rythmo band:', error);
    res.status(500).send('Error deleting rythmo band');
  }
};
