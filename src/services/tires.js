import { TiresCollection } from '../db/models/tire.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

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

  const tireCount = await TiresCollection.find()
    .merge(tireQuery) //зливає (умови з іншого запиту)
    .countDocuments(); //підраховує кількість tire, що задовольняють умови запиту.

  const tires = await tireQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    // .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })  // 1-'asc', -1 - 'desc'
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
