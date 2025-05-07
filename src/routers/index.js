import { Router } from 'express';
import tiresRouter from './tires.js';

const router = Router();
router.use('/tires', tiresRouter);

export default router;
