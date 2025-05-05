import { Router } from 'express';
import {
  getTireByIdController,
  getTiresController,
} from '../controllers/tires.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const router = Router();

router.get('/tires', ctrlWrapper(getTiresController));

router.get('/tires/:tireId', ctrlWrapper(getTireByIdController));

//POST
//DELETE
//PUT - оновлює весь ресурс
//PATCH

export default router;
