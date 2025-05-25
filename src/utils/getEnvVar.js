//змінні оточення
//перевірка наявності зміннної

//тут чи в src/index.js ??
import dotenv from 'dotenv';
dotenv.config(); //ініціалізація змінних оточення

export function getEnvVar(name, defaultValue) {
  const value = process.env[name]; //читання/доступ змінних оточення

  if (value) return value;
  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env[${name}].`);
}

// // можливо так краще??
// import 'dotenv/config'; //зчитування змінних оточення

// //наприклад, якщо змінна порта відсутня то буде по дефолту
// export const getEnv = (envarName, defaultValue) => {
//   const envVar = process.env[envarName];

//   //якщо немає змінної оточення, є дефолтне значення
//   if (!envarName && defaultValue) {
//     return defaultValue;
//   }
//   //якщо немає змінної оточення
//   if (!envVar) {
//     throw new Error(`Env var with name ${envarName} not exist!`);
//   }

//   return envVar;
// };
