import { TiresCollection } from '../db/models/tire.js';

export const getAllTires = async () => {
  const tires = await TiresCollection.find();
  return tires;
};

export const getTireById = async (tireId) => {
  const tire = await TiresCollection.findById(tireId);
  return tire;
};
