import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerUserValidationSchema } from '../validation/registerUserValidation.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginUserController,
  logoutUserController,
  refreshSessionController,
  registerUserController,
} from '../controllers/auth.js';
import { loginUserValidationSchema } from '../validation/loginUserValidationSchema.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/role.js';

const router = Router();

router.post(
  '/register',
  authenticate,
  checkRoles(ROLES.ADMIN),
  validateBody(registerUserValidationSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginUserValidationSchema),
  ctrlWrapper(loginUserController),
);

router.post('/logout', ctrlWrapper(logoutUserController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

export default router;
