const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "chatbot",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");

  io.on("connection", (socket) => {
    console.log(`⚡ : A user has connected : ${socket.id}`);
    socket.on("chat message", (msg) => {
      con.query(
        `SELECT response FROM chatbotdata WHERE input="${msg}"`,
        function (err, result, fields) {
          io.emit("chat message", socket.id + " : " + msg);

          if (err) throw err;
          setTimeout(() => {
            io.emit("chat message", "BOT" + " : " + result[0].response);
            if (msg == "list") {
              con.query(
                `SELECT input FROM chatbotdata`,
                function (err, result, fields) {
                  if (err) throw err;
                  console.log(result);
                  result.forEach((element) => {
                    io.emit("chat message", " - " + element.input);
                  });
                }
              );
            }
          }, 1000);
        }
      );
    });
    socket.on("disconnect", () => {
      console.log(`️‍🔥 : A user has disconnect : ${socket.id}`);
    });
  });
});
server.listen(3000, () => {
  console.log("listening on *:3000");
});
