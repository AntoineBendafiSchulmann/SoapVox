import { Router } from 'express';
import { searchProfiles } from '../controllers/profileController';

const router = Router();

router.get('/search', searchProfiles);

export default router;
