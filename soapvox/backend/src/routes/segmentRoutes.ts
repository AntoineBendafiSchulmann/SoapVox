import { Router } from 'express';
import { saveSegments, getSegments, deleteSegments, deleteSegment } from '../controllers/segmentController';

const router = Router();

router.post('/', saveSegments);
router.get('/', getSegments);
router.delete('/', deleteSegments);
router.delete('/:id', deleteSegment);

export default router;