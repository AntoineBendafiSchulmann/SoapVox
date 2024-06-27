import { Request, Response } from 'express';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

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
    .on('end', () => {
      console.log(`Converted file saved at: ${audioPath}`);
      res.download(audioPath, (err) => {
        if (err) {
          console.error('Error downloading the file:', err);
        }
      });
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

