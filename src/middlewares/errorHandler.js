import { HttpError } from 'http-errors';
import { MongooseError } from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  // Перевірка, чи отримали ми помилку від createHttpError
  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  //   //??? чи потрібно?
  //   if (err instanceof MongooseError) {
  //     return res.status(500).json({
  //       status: 500,
  //       message: err.message,
  //       name: 'Mongoose error',
  //     });
  //   }
  //   //?? чи потрібно?
  //   if (err.isJoi) {
  //     return res.status(400).json({
  //       status: 400,
  //       message: err.message,
  //       errors: err.details.map((err) => ({
  //         message: err.message,
  //         path: err.path,
  //       })),
  //       name: 'Validation error',
  //     });
  //   }

  res.status(500).json({
    message: 'Something went wrong',
    error: err.message,
  });
};
