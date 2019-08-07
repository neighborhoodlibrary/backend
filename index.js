require("dotenv").config();
//
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
const server = express();
// request promise
const rp = require("request-promise");
// xml parser
const parseString = require("xml2js").parseString;
// goodreads api
const goodreadsKey = process.env.GOODREADS_API_KEY;
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
  if (!msg.html) {
    return res.status(400).json({ error: "Must provide html body." });
  }
  try {
    const response = sgMail.send({ ...msg });
    res.status(201).json("Email sent");
  } catch (error) {
    res.status(500).json({ error: "There was a problem sending the email" });
  }
});
//
server.post("/goodreads", async (req, res) => {
  const body = req.body;
  if (!body.query) {
    return res.status(400).json({ error: "Must provide query" });
  }
  if (!body.search) {
    return res.status(400).json({ error: "Must provide search type" });
  }
  try {
    let gUrl = "https://www.goodreads.com/search/index.xml?";
    let key = `key=${goodreadsKey}`;
    let query = `q=${body.query}`;
    let search = `search%5bfield%5d=${body.search}`;
    let URL = `${gUrl}${key}&${query}&${search}`;
    let returnRes = await rp(URL)
      .then(res => {
        parseString(res, (err, result) => {
          res = result.GoodreadsResponse.search[0].results[0].work;
        });
        return res;
      })
      .catch(error => {
        console.log(error);
      });
    res.status(200).json(returnRes);
  } catch (error) {
    res.status(500).json({
      error: "There was a problem sending request to the goodreads api"
    });
  }
});

//
const PORT = process.env.PORT || 9500;
server.listen(PORT, () => console.log("API running..."));
module.exports = { server };
