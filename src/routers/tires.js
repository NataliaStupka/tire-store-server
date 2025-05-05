import { Router } from 'express';
import {
  getTiresByIdController,
  getTiresController,
} from '../controllers/tires.js';

const router = Router();

router.get('/tires', getTiresController);

router.get('/tires/:tireId', getTiresByIdController);

//POST
//DELETE
//PUT - оновлює весь ресурс
//PATCH

export default router;
