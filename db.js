const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Friends3!@localhost:5432/eleven-journal");

module.exports = sequelize;