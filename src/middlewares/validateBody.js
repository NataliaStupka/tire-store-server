import createHttpError from 'http-errors';

// обгортка-валідація
export const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request (validateBody)', {
      errors: err.details,
    });
    next(error);
  }
};

// validateAsync - дозволить виконувати асинхронні операції під час валідації,
