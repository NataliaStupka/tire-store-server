import { isValidObjectId } from 'mongoose'; //????????
import createHttpError from 'http-errors';

export const isValidId =
  (name = 'id') =>
  (req, res, next) => {
    const { tireId } = req.params;

    //якщо не валідний
    if (!isValidObjectId(tireId)) {
      throw createHttpError(400, `${name} is not a valid MongoId`);
    }

    next();
  };
