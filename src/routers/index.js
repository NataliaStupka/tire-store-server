import { Router } from 'express';
import tiresRouter from './tires.js';
import authRouter from './auth.js';

const router = Router();
router.use('/tires', tiresRouter);
router.use('/auth', authRouter);

export default router;
