import createHttpError from 'http-errors';
// import { ROLES } from '../constants/role.js';
// import { TiresCollection } from '../db/models/tire.js'; //Schema

export const checkRoles =
  (...allowedRoles) =>
  async (req, res, next) => {
    const { user } = req;

    try {
      if (!user) {
        next(createHttpError(401, 'User not found'));
        return;
      }

      const { role } = user;
      if (!allowedRoles.includes(role)) {
        next(createHttpError(403, 'Forbidden: Insufficient permissions'));
        return;
      }

      next();
    } catch (err) {
      next(err);
    }
  };
//????????????
