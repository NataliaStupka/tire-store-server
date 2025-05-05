import { TiresCollection } from '../db/models/tire.js';

export const getAllTires = async () => {
  const tires = await TiresCollection.find();
  return tires;
};
// export const getAllTires = async () => {
//   try {
//     const tires = await TiresCollection.find();
//     return tires;
//   } catch (error) {
//     throw new Error(`Error fetching tires: ${error.message}`);
//   }
// };

export const getTireById = async (tireId) => {
  const tire = await TiresCollection.findById(tireId);
  return tire;
};
// export const getTireById = async (tireId) => {
//   try {
//     const tire = await TiresCollection.findById(tireId);
//     if (!tire) throw new Error('Tire not found');
//     return tire;
//   } catch (error) {
//     throw new Error(`Error fetching tire: ${error.message}`);
//   }
// };

//createTire
//updateTire
//deleteTire
