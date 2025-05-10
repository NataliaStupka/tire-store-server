import {
  createTire,
  deleteTire,
  getAllTires,
  getTireById,
  updateTire,
} from '../services/tires.js';
import createHttpError from 'http-errors'; //зручне створення помилок
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFiltersParams } from '../utils/parseFilterParams.js';

export const getTiresController = async (req, res, next) => {
  //pagination
  const { page, perPage } = parsePaginationParams(req.query);
  console.log('req.query - PAGINATION------==', req.query);

  //sort
  const { sortBy, sortOrder } = parseSortParams(req.query);
  console.log('req.query - SORT------==', req.query);

  //filter
  const filter = parseFiltersParams(req.query);
  console.log('req.query - FILTER------==', req.query);

  const tires = await getAllTires({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found tires! ✅',
    data: tires,
  });
};

export const getTireByIdController = async (req, res, next) => {
  const { tireId } = req.params;
  const tire = await getTireById(tireId);

  if (!tire) {
    throw createHttpError(404, 'Tire not found');
  }

  res.json({
    status: 200,
    message: `Successfully found tire with id ${tireId}`,
    data: tire,
  });
};

// POST
export const createTireController = async (req, res) => {
  const tire = await createTire(req.body);

  res.status(201).json({
    status: 200,
    message: 'Successfully created a tire!',
    data: tire,
  });
};

//DELETE
export const deleteTireController = async (req, res, next) => {
  const { tireId } = req.params;

  const tire = await deleteTire(tireId);

  if (!tire) {
    next(createHttpError(404, 'Tire not found'));
    return;
  }

  res.status(204).send();
};

//PUT  - upsert (update + insert)//оновлення існуючого/створення нового
export const upsertTireController = async (req, res, next) => {
  const { tireId } = req.params;

  //const result = await ......
  const tire = await updateTire(tireId, req.body, {
    upsert: true, //дозволяє оновлювати, та створювати ресурс при його відсутності
  });

  if (!tire) {
    next(createHttpError(404, 'Tire not found'));
    return;
  }

  const status = tire.isNew ? 201 : 200;

  res.status(201).json({
    status,
    message: 'Successfully upserted a tire!',
    data: tire.tire, //???? data: result.student,
  });
};

//PATCH
export const patchTireController = async (req, res, next) => {
  const { tireId } = req.params;
  console.log('================', tireId);
  const result = await updateTire(tireId, req.body);

  if (!result) {
    next(createHttpError(404, 'Tire not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a tire!',
    data: result.tire,
  });
};
