import { Router } from 'express';
import { createRythmoBand, getRythmoBands, deleteRythmoBand } from '../controllers/rythmoBandController';

const router = Router();

router.post('/', createRythmoBand);
router.get('/', getRythmoBands);
router.delete('/:id', deleteRythmoBand);

export default router;
