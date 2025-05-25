import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

import { createDirIfNotExist } from './utils/createDirIfNotExist.js';
import { TEMP_DIR_PATH, UPLOADS_DIR_PATH } from './constants/path.js';

////тут чи в utils/getEnvVar ?? - на практичних в utils/getEnvVar
// import dotenv from 'dotenv';
// dotenv.config(); //ініціалізація змінних оточення

const bootstrap = async () => {
  await initMongoDB(); //підключаємось до бази даних

  //при запуску додатку створює папку якщо її ще не існує
  await createDirIfNotExist(TEMP_DIR_PATH);
  await createDirIfNotExist(UPLOADS_DIR_PATH);

  startServer(); //запускаємо сервер
};

bootstrap();
