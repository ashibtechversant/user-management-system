const createHttpError = require('http-errors');
const fs = require('fs').promises;

const usersFilePath = 'data/users.json';

async function writeUsers(users) {
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));
}

module.exports = {
  async createUser(user) {
    const id = new Date().getTime();
    const users = await module.exports.readAllUsers();
    const newUser = { id, ...user };
    users.push(newUser);
    await writeUsers(users);
    return newUser;
  },

  async readAllUsers() {
    const usersData = await fs.readFile(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);
    return users;
  },

  async readUserWithId(userId) {
    const users = await module.exports.readAllUsers();
    const foundUser = users.find((user) => user.id === userId);
    if (!foundUser) throw createHttpError.NotFound('user not found');
    return foundUser;
  },

  async updateUserWithId(userId, updatedData) {
    const users = await module.exports.readAllUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) throw createHttpError.NotFound('user not found');
    const userData = users[userIndex];
    const updatedUser = { ...userData, ...updatedData };
    users.splice(userIndex, 1, updatedUser);
    await writeUsers(users);
    return updatedUser;
  },

  async deleteUserWithId(userId) {
    const users = await module.exports.readAllUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) throw createHttpError.NotFound('user not found');
    users.splice(userIndex, 1);
    await writeUsers(users);
  },

  async deleteFieldsFromUser(userId, ...fields) {
    const users = await module.exports.readAllUsers();
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) throw createHttpError.NotFound('user not found');
    const user = users[userIndex];
    fields.forEach((fieldName) => delete user[fieldName]);
    await writeUsers(users);
    return user;
  },
};
