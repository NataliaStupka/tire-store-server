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

  //sort
  const { sortBy, sortOrder } = parseSortParams(req.query);

  //filter
  const filter = parseFiltersParams(req.query);

  const tires = await getAllTires({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found tires!',
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
  try {
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    const photo = req.file; // {fieldname, originalname, path, ...} // Файл із multer

    const tire = await createTire({
      ...req.body, //name, phoneNumber, isFavourite, contactType
      photo, //збереження фото
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a tire!',
      data: tire,
    });
  } catch (error) {
    console.error('createTireController error:', error.message);
    console.error('Validation error details:', error.details);
  }
};

//PUT  - upsert (update + insert)//оновлення існуючого/створення нового
export const upsertTireController = async (req, res, next) => {
  const { tireId } = req.params;
  const photo = req.file;

  //const result = await ......   //👀??? photo
  const result = await updateTire(
    tireId,
    { ...req.body, photo },
    {
      upsert: true, //дозволяє оновлювати, та створювати ресурс при його відсутності
    },
  );

  if (!result) {
    next(createHttpError(404, 'Tire not found'));
    return;
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully upserted a tire!',
    data: result.tire, //???? data: result.student,
  });
};

//PATCH
export const patchTireController = async (req, res, next) => {
  const { tireId } = req.params;
  const photo = req.file; //{fieldname, originalname, path, ...}
  console.log('Received req.body:', req.body); // Логування для дебагу
  console.log('Received photo:', photo);

  //req.body  чи можна  (req.body,  {photo}) ??? перевірити 👀
  const result = await updateTire(tireId, { ...req.body, photo }); //👀??? photo
  // const result = await updateTire(tireId, {
  //   ...req.body,
  //   ...(photo ? { photo } : {}),
  // });

  if (!result) {
    next(createHttpError(404, 'Tire not found'));
    return;
  }

  res.json({
    status: 200,
    message: 'Successfully patched a tire!',
    // data: result.tire, //???? 👀
    data: result,
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
