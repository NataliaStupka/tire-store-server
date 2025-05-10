import { TiresCollection } from '../db/models/tire.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

// All tire (+sort, +filter)
export const getAllTires = async ({
  page = 1,
  perPage = 10,
  sortOrder = 'asc',
  sortBy,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  //find - Створює базовий запит на пошук tire
  const tireQuery = TiresCollection.find();
  const tireCount = await TiresCollection.find()
    .merge(tireQuery) //зливає (умови з іншого запиту)
    .countDocuments(); //підраховує кількість tire, що задовольняють умови запиту.

  const tires = await tireQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec(); //exeс - запускає запит і повертає результат
  const paginationData = calculatePaginationData(tireCount, perPage, page);

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

//CREATE-Tire  //payload - об’єкт даних tire
export const createTire = async (payload) => {
  const tire = await TiresCollection.create(payload);
  return tire;
};

//DELETE-Tire
export const deleteTire = async (tireId) => {
  const tire = await TiresCollection.findOneAndDelete({
    _id: tireId,
  });
  return tire;
};

//PUT - PATCH  //payload - об’єкт даних для оновлення
////оновлення існуючого/створення нового
export const updateTire = async (tireId, payload, options = {}) => {
  const rawResult = await TiresCollection.findOneAndUpdate(
    { _id: tireId },
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;
  console.log('RAW-----------', rawResult.value);
  return {
    tire: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};
