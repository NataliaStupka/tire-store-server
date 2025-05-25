import fs from 'node:fs/promises';
import path from 'node:path';
import { UPLOADS_DIR_PATH } from '../constants/path.js';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';

//приймає файл і повертає шлях
export const saveFileToLocal = async (photo) => {
  //переносить з тимчасової папки в uploads
  await fs.rename(photo.path, path.join(UPLOADS_DIR_PATH, photo.filename));

  //чутливий до зміни домену, зробити більш гнучким
  return `${getEnvVar(ENV_VARS.BACKEND_DOMAIN)}/uploads/${photo.filename}`;
  //http://localhost:3000/uploads/${photo.filename}
};
