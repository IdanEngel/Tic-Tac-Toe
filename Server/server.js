/* eslint-disable no-unused-vars */
const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

const PORT = process.env.PORT || 8080;

const router = require("./router");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origins: "*:*",
  },
});

io.on("connection", (socket) => {
  console.log("we have a new connection!!!");

  socket.on("join", ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) console.log(error);

    socket.emit("message", {
      user: "admin",
      text: `${user.name} welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joind` });

    socket.join(user.room);

    // callback();
  });

  socket.on("sendMessage", (messgae, cb) => {
    const user = getUser(socket.id);

    io.to(user.room).emit("message", { user: user.name, text: messgae });

    cb();
  });

  socket.on("disconnect", () => {
    console.log("user had left!!!");
  });
});

app.use(router);

server.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}`);
});
