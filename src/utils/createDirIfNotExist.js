//якщо папка не існує, то створюємо її

import fs from 'node:fs/promises';

export const createDirIfNotExist = async (path) => {
  try {
    //чи є щось по даному шляху
    await fs.access(path);
  } catch (err) {
    console.log(err);
    if (err.code === 'ENOENT') {
      await fs.mkdir(path);
    }
  }
};
