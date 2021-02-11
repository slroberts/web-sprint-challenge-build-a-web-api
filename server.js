const express = require("express");
const cors = require("cors");
const projectRouter = require("./data/helpers/projectRouter.js");
const actionRouter = require("./data/helpers/actionRouter.js");

const server = express();
server.use(logger);
server.use(express.json());
server.use(cors());

server.use("/projects", projectRouter);
server.use("/actions", actionRouter);

server.get("/", (req, res) => {
  res.send(`<h2>Build a web API - Sprint Challenge</h2>`);
});

function logger(req, res, next) {
  console.log(
    `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
      "host"
    )}`
  );

  next();
}

module.exports = server;
