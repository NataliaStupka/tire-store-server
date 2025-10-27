//створення користувача: Register/Login/Refresh/Logout, SESSION;
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { UserCollection } from '../db/models/user.js';
import createHttpError from 'http-errors';
import { SessionCollection } from '../db/models/session.js';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants/time-token.js';
import { ROLES } from '../constants/role.js';

// функціонал по створенню сесій: //нові токени доступу та оновлення, часові межі їхньої дії
const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN),
});

//REGISTER   //payload - name, email,password
export const registerUser = async (payload) => {
  // Перевірка, чи вже існує адмін, адмін буде лише один
  const existingAdmin = await UserCollection.findOne({ role: ROLES.ADMIN });
  if (existingAdmin) {
    throw createHttpError(
      403,
      'Registration of new admins is not allowed. Only one admin is permitted.',
    );
  }

  //перевірка email на унікальність
  const user = await UserCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  //хешування паролю
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UserCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

//LOGIN (перевіряємо, створюємо сесію) refresh+access токен
export const loginUser = async (payload) => {
  //перевіряємо, чи зареєстрований такий юзер
  const user = await UserCollection.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  // Порівнюємо хеші паролів
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }
  //видаляємо попередню сесію, якщо вона існує
  await SessionCollection.deleteOne({ userId: user._id });
  //створюємо нову session
  return await SessionCollection.create({
    userId: user._id,
    ...createSession(), //токени доступу та оновлення, часові межі їхньої дії
  });
};

//LOGOUT
export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

//REFRESH-SESSION
export const refreshSession = async ({ sessionId, refreshToken }) => {
  //знаходим сесію
  const session = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });
  //сесії не має
  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }
  //якщо token вже старий
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired!');
  }

  const user = await UserCollection.findById(session.userId);
  if (!user) {
    throw createHttpError(401, 'Session user is not found!');
  }

  // //delete old session
  // await SessionCollection.findByIdAndDelete(session._id);
  // або 🧹 Спочатку видаляємо ВСІ старі сесії цього користувача
  await SessionCollection.deleteMany({ userId: user._id });

  //чистимо сесії в бекенді кожен день
  await SessionCollection.deleteMany({
    refreshTokenValidUntil: { $lt: new Date() },
  });

  //create new session
  const newSession = await SessionCollection.create({
    userId: user._id, //???
    ...createSession(), //токени доступу та оновлення, часові межі їхньої дії
  });
  return newSession;
};
