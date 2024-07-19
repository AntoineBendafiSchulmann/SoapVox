import { Request, Response } from 'express';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';

const register = async (req: Request, res: Response) => {
  const { name, password, email } = req.body;

  try {
    const [result] = await db.query<ResultSetHeader>(
      'INSERT INTO users (name, password, email) VALUES (?, ?, ?)', 
      [name, password, email]
    );
    res.send(`User registered successfully with ID: ${result.insertId}`);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user');
  }
};

export default register;
