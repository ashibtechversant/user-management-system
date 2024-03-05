module.exports = async (users, page, limit) => {
  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const offset = (pageNumber - 1) * limitNumber;
  const dataLength = users.length;
  const totalPages = Math.ceil(dataLength / limitNumber);
  const paginatedData = users.slice(offset, offset + limitNumber);
  return {
    page: pageNumber,
    limit: limitNumber,
    totalPages,
    users: paginatedData,
  };
};
