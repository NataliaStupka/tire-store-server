import { REFRESH_TOKEN } from '../constants/time-token.js';
import { UserCollection } from '../db/models/user.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

//admin

//налаштування cookies
const setupSessionCookies = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true, //доступний тільки через HTTP-запити
    secure: process.env.NODE_ENV === 'production', // Тільки в продакшені
    expires: new Date(Date.now() + REFRESH_TOKEN), //термін дії 30 днів
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + REFRESH_TOKEN),
  });
};

//REGISTER
export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

//LOGIN - обробляє HTTP-запит на вхід користувача, викликає функцію аутентифікації loginUser
// встановлює куки для збереження токенів та ідентифікатора сесії, відправляє клієнту відповідь (про успішний вхід та токеном доступу).
export const loginUserController = async (req, res, next) => {
  try {
    const session = await loginUser(req.body);

    setupSessionCookies(res, session); //налаштування cookies

    const user = await UserCollection.findById(session.userId).select(
      'name email role',
    );

    res.json({
      status: 200,
      message: 'Successfully logged in an user!',
      data: {
        accessToken: session.accessToken,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

//LOGOUT
export const logoutUserController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId); //видаляє сесію user
  }

  // очищає кукі, вихід user з системи на стороні клієнта
  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};

//REFRESH-SESSION
export const refreshSessionController = async (req, res) => {
  const session = await refreshSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupSessionCookies(res, session); //налаштування cookies

  //повертаємо response з новим token
  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
