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

  // Дозволяє фронтенду робити запити до бекенду
  //// // -1 --- з будь-якої адреси -
  // app.use(
  //   cors({
  //     // origin: 'https://tire-store-server.onrender.com', // Адаптуй під свій фронтенд
  //     credentials: true, // Для кукі
  //   }),
  // );
  //// // -1 -- end ==

  // // 2 ---
  // Дозволяє фронтенду робити запити до бекенду
  app.use(
    cors({
      origin: function (origin, callback) {
        const allowedOrigins = [
          'http://localhost:5173', //  розробка
          'https://tire-store.onrender.com', // прод-фронтенд
          // додати swagger, local swager ?
        ];
        // якщо запит прийшов із дозволеного сайту або без origin (наприклад, із Postman)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true); //✅ дозволяємо
        } else {
          callback(new Error('Not allowed by CORS')); // ❌ блокуємо
        }
      },
      credentials: true,
    }),
  );
  //----// -----------!!!
  // app.use(
  //   cors({
  //     origin: ['http://localhost:5173', 'https://tire-store.onrender.com'], // дозволені фронтенди
  //     credentials: true, // щоб cookies проходили
  //   }),
  // );
  // ==========================

  app.use(express.json());
  app.use(cookieParser()); //роботи із куками

  app.use('/uploads', express.static(UPLOADS_DIR_PATH)); // можливість express роздавати статичні файли

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // ???
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

// ⁉️ ⁉️ ⁉️ ⁉️ -----------------------
// Такий порядок гарантує:

// CORS перевіряє запит першим;

// потім express.json() обробляє тіло;

// далі cookieParser() розбирає кукі;

// і лише тоді запит потрапляє до твоїх роутів.
//
// // поставити в такому порядку ???
// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express();

// const allowedOrigins = [
//   'http://localhost:5173',
//   'https://tire-store.onrender.com',
// ];

// // 1️⃣ CORS — має бути перед усім, бо він вирішує, чи можна взагалі продовжувати запит
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//   }),
// );

// // 2️⃣ JSON парсер — щоб Express міг читати тіла запитів
// app.use(express.json());

// // 3️⃣ Парсер кукі — для роботи з cookies (якщо ти зберігаєш сесію або токени в кукі)
// app.use(cookieParser());

// // 4️⃣ (опціонально) Статичні файли або логери
// // app.use(express.static('public'));

// // 5️⃣ Твої маршрути
// app.use('/api/users', userRouter);
// app.use('/api/tires', tiresRouter);
