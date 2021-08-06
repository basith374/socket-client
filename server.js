const fs = require("fs");
const io = require("socket.io")({
//    path: "/ws/",
    cookie: false,
//    transports: ["websocket"]
});
const server = require("http").createServer(function (req, res) {
  fs.readFile(__dirname + "/index.html", function (err, data) {
    res.writeHead(200);
    res.end(data);
  });
});

const activity = {
  connections: 0,
  disconnections: 0,
}
io.on("connection", (socket) => {
  activity.connections++;
  socket.on("disconnect", () => {
    activity.disconnections++;
  })
  // console.log("total connections: ", io.engine.clientsCount);
});
let idle = false;
setInterval(() => {
  if(io.engine.clientsCount) {
    idle = false;
    const time = new Date().getMinutes() + ":" + new Date().getSeconds()
    console.log("emitting", time, "connections", io.engine.clientsCount, "new", activity.connections, "closed", activity.disconnections);
    activity.connections = activity.disconnections = 0;
    io.emit("foo", time);
  } else {
    if (!idle) console.log("waiting for connections");
    idle = true;
  }
}, 1000);
io.attach(server);
server.listen(8000);
