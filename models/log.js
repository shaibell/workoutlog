const { DataTypes } = require("sequelize");
const db = require("../db");

const Log = db.define('log', {
    title: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    date: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    result: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owner_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

module.exports = Log;