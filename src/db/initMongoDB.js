import mongoose from 'mongoose'; //робота з MongoDB
import { getEnvVar } from '../utils/getEnvVar.js'; //змінні оточення

export const initMongoDB = async () => {
  try {
    const user = getEnvVar('MONGODB_USER');
    const password = getEnvVar('MONGODB_PASSWORD');
    const url = getEnvVar('MONGODB_URL');
    const db = getEnvVar('MONGODB_DB');

    const conectionURL = `mongodb+srv://${user}:${password}@${url}/${db}?retryWrites=true&w=majority&appName=Cluster0`;
    await mongoose.connect(conectionURL);

    console.log('Mongo connection successfully established! 👍');
  } catch (err) {
    console.error('Error while setting up mongo connection 🚫', err);
    process.exit(1); //закінчуємо процес і виходимо з кодом 1
    //якщо код 0, то це означає що додаток відпрацював коректно. якщо не з 0 - то щось пішло не  так.
  }
};
