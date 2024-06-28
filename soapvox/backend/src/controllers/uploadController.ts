import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { ResultSetHeader } from 'mysql2';

export const uploadVideo = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath = req.file.path;
  const audioPath = path.join('uploads', `${req.file.filename}.mp3`);

  console.log(`Uploaded file path: ${filePath}`);

  ffmpeg(filePath)
    .toFormat('mp3')
    .save(audioPath)
    .on('end', async () => {
      console.log(`Converted file saved at: ${audioPath}`);
      try {
        const [result] = await db.query<ResultSetHeader>(
          'INSERT INTO uploads (filename, file_path) VALUES (?, ?)', 
          [req.file?.filename, audioPath]//ajouter une vérification de type afin de garantir que req.file est défini avant de l'utiliser
        );
        res.status(201).json({ upload_id: result.insertId });
      } catch (error) {
        console.error('Error saving upload info:', error);
        res.status(500).send('Error saving upload info');
      }
    })
    .on('error', (err: any) => {
      console.error('Error processing the file:', err);
      res.status(500).send('Error processing the file');
    });
};

export const listVideos = (req: Request, res: Response) => {
  fs.readdir('uploads', (err, files) => {
    if (err) {
      console.error('Error reading the uploads directory:', err);
      return res.status(500).send('Error reading the uploads directory');
    }

    const videoFiles = files.filter(file => file.endsWith('.mp3'));
    res.json(videoFiles);
  });
};
