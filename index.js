require("dotenv").config();
//
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const server = express();
//
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
// test for base url
server.get("/", (req, res) => {
  res.send("<h1>Server Running<h1>");
});

//
const PORT = process.env.PORT || 9500;
server.listen(PORT, () => console.log("API running..."));
module.exports = { server };
