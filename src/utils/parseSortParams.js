export const parseSortParams = (query) => {
  const sortOrder = ['asc', 'desc'].includes(query.sortOrder)
    ? query.sortOrder
    : 'asc';

  const sortBy = ['title', 'price', 'instock'].includes(query.sortBy)
    ? query.sortBy
    : 'id';

  return { sortOrder, sortBy };
};
