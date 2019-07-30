require("dotenv").config();
//
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const server = express();
// twilio send grid
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//
server.use(express.json());
server.use(helmet());
server.use(morgan("dev"));
server.use(cors());
// test for base url
server.get("/", (req, res) => {
  res.send("<h1>Server Running<h1>");
});

server.post("/email", async (req, res) => {
  const msg = req.body;
  if (!msg.to) {
    return res.status(400).json({ error: "Must provide email to send to." });
  }
  if (!msg.from) {
    return res.status(400).json({ error: "Must provide email to send from." });
  }
  if (!msg.subject) {
    return res.status(400).json({ error: "Must provide subject matter." });
  }
  if (!msg.text) {
    return res.status(400).json({ error: "Must provide text body." });
  }
  try {
    const response = sgMail.send({ ...msg });
    res.status(201).json("Email sent");
  } catch (error) {
    res.status(500).json({ error: "There was a problem sending the email" });
  }
});

//
const PORT = process.env.PORT || 9500;
server.listen(PORT, () => console.log("API running..."));
module.exports = { server };
