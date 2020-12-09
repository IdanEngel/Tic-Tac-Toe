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


const getUser = id => users.find(user => user.id === id);


const showUsers = () => users


module.exports = {addUser, getUser ,showUsers}