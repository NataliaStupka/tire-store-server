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
import { upload } from '../middlewares/multer.js';
//authenticate
import { authenticate } from '../middlewares/authenticate.js';
//authorization
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/role.js';

const router = Router();
router.use('/:tireId', isValidId('tireId')); //відпрацює скрізь де є шлях :tireId
// router.use(authenticate); //для всіх шляхів з /tires

// // Middleware для вибору схеми валідації для PUT
// const selectUpsertSchema = async (req, res, next) => {
//   const { tireId } = req.params;
//   try {
//     const tire = await TiresCollection.findById(tireId);
//     req.validationSchema = tire ? updateTireSchema : createTireSchema;
//     next();
//   } catch (error) {
//     next(createHttpError(500, 'Error checking tire existence'));
//   }
// };

// GET-запити доступні всім без авторизації
router.get('/', ctrlWrapper(getTiresController));
router.get('/:tireId', ctrlWrapper(getTireByIdController));

// Захищені операції для адміна
//POST
router.post(
  '/',
  upload.single('image'), //завантажування фото
  authenticate,
  checkRoles(ROLES.ADMIN),
  validateBody(createTireSchema),
  ctrlWrapper(createTireController),
);

//PUT - //оновлення існуючого/створення нового
router.put(
  '/:tireId',
  upload.single('image'), //завантажування фото   ??? тут потрібно?
  authenticate,
  checkRoles(ROLES.ADMIN),
  validateBody(createTireSchema),
  ctrlWrapper(upsertTireController),
);

// router.put(
//   '/:tireId',
//   selectUpsertSchema,
//   (req, res, next) => validateBody(req.validationSchema)(req, res, next),
//   ctrlWrapper(upsertTireController),
// );

//PATCH
router.patch(
  '/:tireId',
  upload.single('image'), //завантажування фото
  authenticate,
  checkRoles(ROLES.ADMIN),
  validateBody(updateTireSchema),
  ctrlWrapper(patchTireController),
);

//DELETE
router.delete(
  '/:tireId',
  authenticate,
  checkRoles(ROLES.ADMIN),
  ctrlWrapper(deleteTireController),
);

export default router;
