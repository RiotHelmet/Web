const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

io.on("connection", (socket) => {
  console.log(`⚡ : A user has connected : ${socket.id}`);
  socket.on("chat message", (msg) => {
    io.emit("chat message", socket.id + " : " + msg);
  });
  socket.on("disconnect", () => {
    console.log(`️‍🔥 : A user has disconnect : ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
