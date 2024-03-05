module.exports = async (users, searchQuery) => {
  const search = searchQuery ? searchQuery.toLowerCase() : '';
  const searchResult = users.filter(
    (user) =>
      user.email.includes(search) ||
      user.firstName.toLowerCase().includes(search) ||
      user.lastName.toLowerCase().includes(search)
  );
  return searchResult;
};
