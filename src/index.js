import { initMongoDB } from './db/initMongoDB.js';
import { startServer } from './server.js';

const bootstrap = async () => {
  await initMongoDB(); //підключаємось до бази даних
  startServer(); //запускаємо сервер
};

bootstrap();
