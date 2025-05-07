import { TiresCollection } from '../db/models/tire.js';

export const getAllTires = async () => {
  const tires = await TiresCollection.find();
  return tires;
};

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
