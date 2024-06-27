import { Router } from 'express';
import { saveSegments, getSegments, deleteSegments } from '../controllers/segmentController';

const router = Router();

router.post('/', saveSegments);
router.get('/', getSegments);
router.delete('/', deleteSegments);

export default router;
