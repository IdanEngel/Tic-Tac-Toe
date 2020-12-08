/* eslint-disable no-unused-vars */

const users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const exitingUser = users.find(
    (user) => user.room === room && user.name === name
  );

  if (exitingUser) {
    return { error: "Username is taken" };
  }
  const user = { id, name, room };
  users.push(user);

  return { user };
};

const removeUser = id => {
    const index = users.findIndex(user => user.id === id)

    if (index !== -1) {
        users.splice(index, 1);
    }
};

const getUser = id => users.find(user => user.id === id);

const getUsersInRoom = room => users.filter(user => user.room === room);

const showUsers = () => users


module.exports = {addUser, removeUser, getUser, getUsersInRoom ,showUsers}