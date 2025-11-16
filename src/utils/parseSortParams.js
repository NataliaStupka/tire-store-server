export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';

  const sortBy = [
    'title',
    'price',
    'instock',
    'createdAt',
    '_id',
    'category',
  ].includes(query.sortBy)
    ? query.sortBy
    : '_id';

  return { sortOrder, sortBy };
};
