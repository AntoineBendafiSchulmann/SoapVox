import { Router } from 'express';
import {
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  searchProfiles
} from '../controllers/profileController';

const router = Router();

router.post('/', createProfile);
router.get('/:id', getProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);
router.get('/search', searchProfiles);

export default router;
