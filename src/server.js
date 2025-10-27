import express from 'express';
import cors from 'cors'; //взаємодія бекенду із фронтендом (запити)
import pino from 'pino-http'; //логування

import { getEnvVar } from './utils/getEnvVar.js'; // чи є данні змінної оточення (.env)
import tiresRouters from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UPLOADS_DIR_PATH } from './constants/path.js';
import cookieParser from 'cookie-parser';

const PORT = Number(getEnvVar('PORT', 3000)); //читання/доступ змінних оточення

export const startServer = () => {
  const app = express();

  // app.use(
  //   cors({
  //     origin: ['http://localhost:5173', 'https://tire-store-client.vercel.app'], // дозволені фронтенди
  //     credentials: true, // щоб cookies проходили
  //   }),
  // );

  // Дозволяє фронтенду робити запити до бекенду
  const allowedOrigins = [
    'http://localhost:5173', //  розробка
    'https://tire-store-client.vercel.app', // прод-фронтенд
    // додати swagger, local swager ?
  ];
  // 1️⃣ CORS — має бути перед усім, бо він вирішує, чи можна взагалі продовжувати запит
  app.use(
    cors({
      origin: function (origin, callback) {
        // якщо запит прийшов із дозволеного сайту або без origin (наприклад, із Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); //✅ дозволяємо
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`)); // ❌ блокуємо
        }
      },
      credentials: true, //щоб браузер надсилав куки (refreshToken і sessionId)
    }),
  );

  app.use(express.json()); // 2️⃣ JSON парсер — щоб Express міг читати тіла запитів
  app.use(cookieParser()); // 3️⃣ робота із куками

  app.use('/uploads', express.static(UPLOADS_DIR_PATH)); // 4️⃣ можливість express роздавати статичні файли

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // 5️⃣ маршрути
  app.get('/', (req, res) => {
    res.json({
      message: 'Hello World, this is Tire Store',
    });
  });

  //
  app.use(tiresRouters); // Додаємо роутер до app як middleware

  app.use('*', notFoundHandler); //Route not found - 404
  app.use(errorHandler); //Something went wrong - 500

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
