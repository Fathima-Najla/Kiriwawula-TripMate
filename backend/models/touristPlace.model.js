const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const TouristPlace = sequelize.define(
    "TouristPlace",
    {
        placeId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        placeName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false
       },

        description: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        location: {
            type: DataTypes.STRING(255),
            allowNull: false
        },

        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false
        },

        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false
        },

        entranceFee: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        },

        openingTime: {
            type: DataTypes.TIME,
            allowNull: true
        },

        closingTime: {
            type: DataTypes.TIME,
            allowNull: true
        }
    },
    {
        tableName: "tourist_places",
        timestamps: false
    }
);

module.exports = TouristPlace;