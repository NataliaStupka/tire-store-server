const parceCategory = (category) => {
  const isString = typeof category === 'string';
  if (!isString) return;

  const isCategory = (category) =>
    ['loader', 'industrial', 'agricultural', 'rims'].includes(category);

  if (isCategory(category)) return category;
};

const parceTitle = (title) => {
  if (['Шина', 'Диск'].includes(title)) return title;
};

const parseNumber = (number) => {
  const isString = typeof number === 'string';
  if (!isString) return;

  const parsedNumber = parseInt(number);
  if (Number.isNaN(parsedNumber)) {
    return;
  }
  return parsedNumber;
};

const parseTireType = (type) => {
  //   const isString = typeof type === 'string';
  //   if (!isString) return;

  //   const isTireType = (type) => {
  //     ['tl', 'tt'].includes(type);
  //   };
  if (['tl', 'tt'].includes(type)) return type;
};

const parseBoolean = (string) => {
  if (['true', 'false'].includes(string)) return JSON.parse(string);
};

export const parseFiltersParams = (filter) => {
  const {
    category,
    title,
    price, //?? чи потрібно
    minPrice,
    maxPrice,
    // size,
    // producer,
    // modelTire,
    // layering,
    // loadIndex,
    tireType,
    // diskModel,
    instock,
  } = filter;

  return {
    category: parceCategory(category),
    title: parceTitle(title),
    price: parseNumber(price), //?? чи потрібно
    minPrice: parseNumber(minPrice),
    maxPrice: parseNumber(maxPrice),
    tireType: parseTireType(tireType),
    instock: parseBoolean(instock),
  };
};
