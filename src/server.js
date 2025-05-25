import express from 'express';
import cors from 'cors'; //взаємодія бекенду із фронтендом (запити)
import pino from 'pino-http'; //логування

import { getEnvVar } from './utils/getEnvVar.js'; // чи є данні змінної оточення (.env)
import tiresRouters from './routers/index.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UPLOADS_DIR_PATH } from './constants/path.js';

const PORT = Number(getEnvVar('PORT', 3000)); //читання/доступ змінних оточення

export const startServer = () => {
  const app = express();

  app.use(express.json());

  // Дозволяє фронтенду робити запити до бекенду
  app.use(cors());

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
