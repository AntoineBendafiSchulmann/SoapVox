import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

ffmpeg.getAvailableFormats(function (err, formats) {
  if (err) {
    console.error('FFmpeg is not available:', err);
    process.exit(1);
  } else {
    console.log('FFmpeg is available:', formats);
  }
});

app.post('/upload', upload.single('video'), (req, res) => {
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
});

app.post('/segments', async (req, res) => {
  const { segments } = req.body;

  if (!Array.isArray(segments)) {
    return res.status(400).send('Segments should be an array');
  }

  try {
    await db.query('DELETE FROM segments');
    const promises = segments.map(segment =>
      db.query('INSERT INTO segments (start, end, text, `character`) VALUES (?, ?, ?, ?)', [
        segment.start, segment.end, segment.text, segment.character,
      ])
    );

    await Promise.all(promises);
    res.sendStatus(200);
  } catch (error) {
    console.error('Error saving segments:', error);
    res.status(500).send('Error saving segments');
  }
});

app.get('/segments', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM segments');
    res.json(rows);
  } catch (error) {
    console.error('Error loading segments:', error);
    res.status(500).send('Error loading segments');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
