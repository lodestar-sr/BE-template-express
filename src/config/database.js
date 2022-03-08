const Sequelize = require('sequelize');
const { config } = require('dotenv');

config();

exports.sequelize = new Sequelize({
  dialect: process.env.DB,
  storage: process.env.DB_STORAGE,
});