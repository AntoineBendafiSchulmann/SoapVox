import { Router } from 'express';
import {
  searchProfiles,
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile
} from '../controllers/profileController';

const router = Router();

router.get('/search', searchProfiles);
router.get('/:id', getProfile);
router.post('/', createProfile);
router.put('/:id', updateProfile);
router.delete('/:id', deleteProfile);

export default router;
