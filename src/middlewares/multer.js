import multer from 'multer';
import { TEMP_DIR_PATH } from '../constants/path.js'; // src/temp;

//зберігання файлів(фото)
const storage = multer.diskStorage({
  //визначення місця куди зберігаємо файли (тимчасово перед зберіганням на хмару)
  destination: function (req, file, cb) {
    cb(null, TEMP_DIR_PATH); //куди зберігаємо //null - якщо буде помилка, TEMP_DIR_PATH - якщо результат виконання
  },
  //як будуть називатися
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  //   limits: { fileSize: 5 * 1024 * 1024 }, //// 5MB Обмежує розмір файлів
});
