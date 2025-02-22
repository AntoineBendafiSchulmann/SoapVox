import { Router } from 'express';
import multer from 'multer';
import { uploadVideo, listVideos, getAudio } from '../controllers/uploadController';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.post('/video', upload.single('video'), uploadVideo);
router.get('/videos', listVideos);
router.get('/audio/:id', getAudio);  

export default router;
