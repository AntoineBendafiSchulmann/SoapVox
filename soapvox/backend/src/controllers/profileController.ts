import { Request, Response } from 'express';
import { db } from '../db';
import { RowDataPacket } from 'mysql2';

export const searchProfiles = async (req: Request, res: Response) => {
  const tags = req.query.tags as string;

  if (!tags) {
    return res.status(400).send('Tags parameter is required');
  }

  const tagsArray = tags.split(',').map(tag => tag.trim());

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      'SELECT * FROM profiles WHERE tags REGEXP ?',
      [tagsArray.join('|')]
    );
    res.json(rows);
  } catch (error) {
    console.error('Error searching profiles:', error);
    res.status(500).send('Error searching profiles');
  }
};
