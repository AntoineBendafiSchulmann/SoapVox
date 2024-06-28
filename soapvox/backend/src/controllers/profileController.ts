import { Request, Response } from 'express';
import { db } from '../db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';


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



export const getProfile = async (req: Request, res: Response) => {
  const profileId = req.params.id;

  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM profiles WHERE id = ?', [profileId]);
    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Error fetching profile');
  }
};


export const createProfile = async (req: Request, res: Response) => {
    const { user_id, bio, tags, demo_tapes } = req.body;
  
    try {
      const [result] = await db.query<ResultSetHeader>(
        'INSERT INTO profiles (user_id, bio, tags, demo_tapes) VALUES (?, ?, ?, ?)',
        [user_id, bio, tags, demo_tapes]
      );
      res.status(201).json({ id: result.insertId });
    } catch (error) {
      console.error('Error creating profile:', error);
      res.status(500).send('Error creating profile');
    }
  };  


export const updateProfile = async (req: Request, res: Response) => {
  const profileId = req.params.id;
  const { bio, tags, demo_tapes } = req.body;

  try {
    const [result] = await db.query<ResultSetHeader>(
      'UPDATE profiles SET bio = ?, tags = ?, demo_tapes = ? WHERE id = ?',
      [bio, tags, demo_tapes, profileId]
    );
    if (result.affectedRows > 0) {
      res.send('Profile updated successfully');
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Error updating profile');
  }
};


export const deleteProfile = async (req: Request, res: Response) => {
  const profileId = req.params.id;

  try {
    const [result] = await db.query<ResultSetHeader>('DELETE FROM profiles WHERE id = ?', [profileId]);
    if (result.affectedRows > 0) {
      res.send('Profile deleted successfully');
    } else {
      res.status(404).send('Profile not found');
    }
  } catch (error) {
    console.error('Error deleting profile:', error);
    res.status(500).send('Error deleting profile');
  }
};
