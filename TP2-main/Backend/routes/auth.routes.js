import { Router } from 'express';
import { login, getMe, register } from '../controllers/auth.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { checkRole } from '../middleware/checkRole.js';

const router = Router();

router.post('/login', login);
router.get('/me', verifyToken, getMe);
router.post('/register', verifyToken, checkRole('admin'), register);

export default router;
