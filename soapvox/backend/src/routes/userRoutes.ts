import { Router } from 'express';
import { getUser, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
