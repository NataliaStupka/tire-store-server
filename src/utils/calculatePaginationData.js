//повертає об'єкт з повною інформацією про пагінацію
export const calculatePaginationData = (count, perPage, page) => {
  //Math.ceil - округлює число вгору
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = Boolean(totalPages - page);
  const hasPreviousPage = page !== 1;

  return {
    page,
    perPage,
    totalItems: count,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};
