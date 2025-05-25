import cloudinary from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';
import { ENV_VARS } from '../constants/env.js';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';

cloudinary.config({
  cloud_name: getEnvVar(ENV_VARS.CLOUDINARY_CLOUD_NAME),
  api_key: getEnvVar(ENV_VARS.CLOUDINARY_API_KEY),
  api_secret: getEnvVar(ENV_VARS.CLOUDINARY_API_SECRET),
});

//приймає файл і повертає шлях
export const saveFileToCloudinary = async (file) => {
  console.log('Uploading file to Cloudinary:', file.path);
  try {
    const res = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'tires', //ображення зберігалися в папці tires у Cloudinary
      quality: 'auto:low', //зменшує розмір файлів без значної втрати якості.
    });
    console.log('Cloudinary upload success:', res.secure_url, res.public_id);
    return { url: res.secure_url, publicId: res.public_id }; //шлях і id
  } catch (err) {
    console.error('Cloudinary upload error:', err);
    throw createHttpError(500, 'Failed to upload an image to cloudinary');
  } finally {
    try {
      //видаляємо зображення з тимчасової папки
      await fs.unlink(file.path);
      console.log('Deleted temp file:', file.path);
    } catch (err) {
      console.error('Failed to delete temp file:', err);
    }
  }
};
