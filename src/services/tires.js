import { TiresCollection } from '../db/models/tire.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { saveFile } from '../utils/saveFile.js';
import cloudinary from 'cloudinary';

// All tire (+sort, +filter)
export const getAllTires = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy,
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  //find - Створює базовий запит на пошук tire
  const tireQuery = TiresCollection.find();

  //filter
  console.log('FILTER-services', filter);
  if (filter.category) {
    tireQuery.where('category').equals(filter.category);
  }
  if (filter.title) {
    tireQuery.where('title').equals(filter.title);
  }
  if (filter.minPrice !== undefined || filter.maxPrice !== undefined) {
    const priceFilter = {};
    if (filter.minPrice !== undefined) priceFilter.$gte = filter.minPrice; //>=
    if (filter.maxPrice !== undefined) priceFilter.$lte = filter.maxPrice; //<=
    tireQuery.where('price').$gte(priceFilter.$gte).lte(priceFilter.$lte);
  }
  if (filter.tireType) {
    tireQuery.where('tireType').equals(filter.tireType);
  }
  // не зрозуміла ??
  if (filter.instock || filter.instock === false) {
    tireQuery.where('instock').equals(filter.instock);
  }
  if (filter.size) {
    tireQuery.where('size').regex(new RegExp(filter.size, 'i')); // 'i' - нечутливість до регістру; шукаємо часткові співпадіння
  }
  // ПОЯСНИ!!! для чого це? 👀 👀 👀 👀 👀 equals - ?
  if (filter.isProductOfDay || filter.isProductOfDay === false) {
    tireQuery.where('isProductOfDay').equals(filter.isProductOfDay);
  }

  tireQuery.sort(sortBy ? { [sortBy]: sortOrder } : { _id: 1 });
  const tireCount = await tireQuery.clone().countDocuments();

  // const tireCount = await TiresCollection.find()
  //   .merge(tireQuery) //зливає (умови з іншого запиту)
  //   .countDocuments(); //підраховує кількість tire, що задовольняють умови запиту.

  const tires = await tireQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 }) // 1-'asc', -1 - 'desc'
    .exec(); //exeс - запускає запит і повертає результат
  const paginationData = calculatePaginationData(tireCount, perPage, page);
  console.log('TIRES===============-----', tires);
  return {
    data: tires,
    ...paginationData,
  };
};

//tire by ID
export const getTireById = async (tireId) => {
  const tire = await TiresCollection.findById(tireId);
  return tire;
};

//GET diameters rims
export const getUniqueRimsDiameters = async () => {
  //distinct - повертає унікальні значення певного поля з колекції.
  //дістане усі унікальні значення поля size, в category = 'rims',
  const sizes = await TiresCollection.distinct('size', { category: 'rims' });
  console.log('⚡️ sizes: ', sizes);

  return sizes
    .filter(Boolean) //прибере false, null, undefined, '', 0, залишить "цифри"
    .map((size) => parseFloat(String(size).replace(',', '.'))) //перетворили в число
    .filter((number) => !isNaN(number))
    .sort((a, b) => a - b);
};

//CREATE-Tire  //payload - {об’єкт} даних tire (весь запит)
export const createTire = async (payload) => {
  let image = null; //посилання на фото
  let imagePublicId = null;

  if (payload.photo) {
    console.log('payload.photo', payload.photo); // {filedname:, ..., path:, ...}
    //// Отримуємо URL з Cloudinary
    const result = await saveFile(payload.photo); //зберігає локально/cloudinary, залежно від змінної оточення
    image = result.url;
    imagePublicId = result.publicId;
  }

  const tire = await TiresCollection.create({
    ...payload,
    price: Number(payload.price), //??
    instock: payload.instock === 'true', //??
    image, //за замовчуванням null
    imagePublicId, //
  });
  return tire;
};

//PUT - PATCH  //payload - об’єкт даних для оновлення
////оновлення існуючого/створення нового
export const updateTire = async (
  tireId,
  { photo, ...payload },
  options = {},
) => {
  let updatedImage = null; //посилання на фото
  let updatedImagePublicId = null;

  // Якщо передано нове фото
  if (photo) {
    console.log('Зберігаємо фото');
    //// Отримуємо { url, publicId } з Cloudinary
    const result = await saveFile(photo); // { url, publicId }

    updatedImage = result.url;
    updatedImagePublicId = result.publicId;

    // Знаходимо поточну шину для видалення старого зображення
    const currentTire = await TiresCollection.findById(tireId);
    if (currentTire && currentTire.imagePublicId) {
      try {
        await cloudinary.v2.uploader.destroy(currentTire.imagePublicId);
        console.log(
          'Deleted old image from Cloudinary:',
          currentTire.imagePublicId,
        );
      } catch (err) {
        console.error('Failed to delete old image from Cloudinary:', err);
      }
    }
  }

  const rawResult = await TiresCollection.findOneAndUpdate(
    { _id: tireId },
    {
      ...payload,
      ...(updatedImage
        ? { image: updatedImage, imagePublicId: updatedImagePublicId }
        : {}),
      updatedAt: Date.now(), // Оновлюємо timestamp
    },
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  return {
    tire: rawResult.value,
    // ...rawResult.value.toObject(), //????
    isNew: Boolean(rawResult?.lastErrorObject?.upserted), //???
  };
};

//DELETE-Tire
export const deleteTire = async (tireId) => {
  const tire = await TiresCollection.findOneAndDelete({
    _id: tireId,
  });

  //якщо є зображення, то видаляємо і його з хмарного сховища ???? ❌ 🏞️
  if (tire && tire.imagePublicId) {
    try {
      await cloudinary.v2.uploader.destroy(tire.imagePublicId);
      console.log('Deleted image from Cloudinary:', tire.imagePublicId);
    } catch (err) {
      console.error('Failed to delete image from Cloudinary:', err);
    }
  }
  return tire;
};
