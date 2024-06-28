import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { db } from '../db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

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
          [req.file?.filename, audioPath] 
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

export const getAudio = async (req: Request, res: Response) => {
  const uploadId = req.params.id;
  try {
    const [rows] = await db.query<RowDataPacket[]>('SELECT file_path FROM uploads WHERE upload_id = ?', [uploadId]);
    if (rows.length > 0) {
      const audioPath = rows[0].file_path;
      if (fs.existsSync(audioPath)) {
        res.sendFile(path.resolve(audioPath));
      } else {
        res.status(404).send('Audio file not found');
      }
    } else {
      res.status(404).send('Upload not found');
    }
  } catch (error) {
    console.error('Error fetching audio file:', error);
    res.status(500).send('Error fetching audio file');
  }
};
