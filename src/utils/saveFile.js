import createHttpError from 'http-errors';
import { ENV_VARS } from '../constants/env.js';
import { getEnvVar } from './getEnvVar.js';
import { saveFileToCloudinary } from './saveFileToCloudinary.js';
import { saveFileToLocal } from './saveFileToLocal.js';

export const saveFile = async (file) => {
  const strategy = getEnvVar(ENV_VARS.SAVE_FILE_STRATEGY);

  if (strategy === 'cloudinary') {
    return await saveFileToCloudinary(file); // Повертає { url, publicId }
  }
  if (strategy === 'local') {
    const url = await saveFileToLocal(file);
    return { url, publicId: null };
  }

  throw createHttpError(500, 'No file storage trategy set');
};
