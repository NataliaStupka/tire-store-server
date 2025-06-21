//обробляє запит на аутентифікацію, перевіряє наявність і дійсність заголовка авторизації та токена доступу,

import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { UserCollection } from '../db/models/user.js';

//next - передає до наступної функції
export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization'); //отримує заголовок авторизації

  try {
    if (!authHeader) {
      next(createHttpError(401, 'Please provide Authorization header'));
      return;
    }

    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1]; //отримуємо токен

    if (bearer !== 'Bearer' || !token) {
      next(createHttpError(401, 'Auth header should be of type Bearer'));
      return;
    }
    if (!token) {
      throw new createHttpError(401, 'No Access token provided!');
    }
    //Перевірка наявності сесії:
    const session = await SessionCollection.findOne({
      accessToken: token,
    });
    if (!session) {
      next(createHttpError(401, 'Session not found'));
      return;
    }

    //Перевірка терміну дії токена доступу
    if (session.accessTokenValidUntil < new Date()) {
      await SessionCollection.findByIdAndDelete(session._id);
      throw createHttpError(401, 'Session token expired! ');
    }

    const user = await UserCollection.findById(session.userId);
    if (!user) {
      await SessionCollection.findByIdAndDelete(session._id); //????
      next(createHttpError(401, 'No user found for such session!'));
      return;
    }
    //додає об'єкт користувача до запиту
    req.user = user;

    next(); //Викликається наступна функція
  } catch (err) {
    next(err);
  }
};
