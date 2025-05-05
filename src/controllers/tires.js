import { getAllTires, getTireById } from '../services/tires.js';

export const getTiresController = async (req, res) => {
  const tires = await getAllTires();

  res.json({
    status: 200,
    message: 'Successfully found tires! ✅',
    data: tires,
  });
};

export const getTiresByIdController = async (req, res) => {
  const { tireId } = req.params;
  const tire = await getTireById(tireId);

  if (!tire) {
    res.status(404).json({
      message: 'Tire not found',
    });
  }

  res.json({
    status: 200,
    message: `Successfully found tire with id ${tireId}`,
    data: tire,
  });
};
