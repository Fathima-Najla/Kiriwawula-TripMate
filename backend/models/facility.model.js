const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Facility = sequelize.define(
    "Facility",
    {
        facilityId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        facilityName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        tableName: "facilities",
        timestamps: false
    }
);

module.exports = Facility;