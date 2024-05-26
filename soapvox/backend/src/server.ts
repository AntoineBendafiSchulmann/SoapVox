import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3001;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

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
        //si on commente cette ligne, le fichier audio reste dans le dossier uploads 
        //fs.unlinkSync(filePath);
       //fs.unlinkSync(audioPath);

      });
    })
    .on('error', (err: any) => {
      console.error('Error processing the file:', err);
      res.status(500).send('Error processing the file');
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
