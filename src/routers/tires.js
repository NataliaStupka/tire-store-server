import { Router } from 'express';
import {
  createTireController,
  deleteTireController,
  getTireByIdController,
  getTiresController,
  patchTireController,
  upsertTireController,
} from '../controllers/tires.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
//валідація
import { validateBody } from '../middlewares/validateBody.js';
import { createTireSchema, updateTireSchema } from '../validation/tire.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();
router.use('/:tireId', isValidId('tireId')); //відпрацює скрізь де є шлях :tireId

router.get('/', ctrlWrapper(getTiresController));

router.get('/:tireId', ctrlWrapper(getTireByIdController));

//POST
router.post(
  '/',
  validateBody(createTireSchema),
  ctrlWrapper(createTireController),
);

//DELETE
router.delete('/:tireId', ctrlWrapper(deleteTireController));

//PUT - //оновлення існуючого/створення нового
router.put(
  '/:tireId',
  validateBody(createTireSchema),
  ctrlWrapper(upsertTireController),
);

//PATCH
router.patch(
  '/:tireId',
  validateBody(updateTireSchema),
  ctrlWrapper(patchTireController),
);

export default router;
