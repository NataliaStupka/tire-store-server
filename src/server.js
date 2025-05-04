import express from 'express';
import cors from 'cors'; //взаємодія бекенду із фронтендом (запити)
import pino from 'pino-http'; //логування

import { getEnvVar } from './utils/getEnvVar.js'; // чи є данні змінної оточення (.env)
import { getAllTires, getTireById } from './services/tires.js';

const PORT = Number(getEnvVar('PORT', 3000)); //читання/доступ змінних оточення

export const startServer = () => {
  const app = express();

  app.use(express.json());

  // Дозволяє фронтенду робити запити до бекенду
  app.use(cors());

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

  app.get('/tires', async (req, res) => {
    const tires = await getAllTires();
    res.status(200).json({
      data: tires,
    });
  });
  app.get('/tires/:tireId', async (req, res, next) => {
    const { tireId } = req.params;
    const tire = await getTireById(tireId);

    if (!tire) {
      res.status(404).json({
        message: 'Tire not found',
      });
      return;
    }

    res.status(200).json({
      data: tire,
    });
  });

  //
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
