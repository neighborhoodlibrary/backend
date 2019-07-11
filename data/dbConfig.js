const knex = require("knex");
const environment = process.env.NODE_ENV || "development";
const knexConfig = require("../knexfile")[environment];
module.exports = knex(knexConfig);
