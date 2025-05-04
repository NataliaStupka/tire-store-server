//змінні оточення
//перевірка наявності зміннної

import dotenv from 'dotenv';

dotenv.config(); //ініціалізація змінних оточення

export function getEnvVar(name, defaultValue) {
  const value = process.env[name]; //читання/доступ змінних оточення

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env[${name}].`);
}
