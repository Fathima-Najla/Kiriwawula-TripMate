const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Attraction = sequelize.define(
    "Attraction",
    {
        attractionId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        placeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attractionName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(10, 7),
            allowNull: true
        }
    },
    {
        tableName: "Attractions",
        timestamps: false
    }
);

module.exports = Attraction;