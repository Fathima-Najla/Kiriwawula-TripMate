const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const ItineraryPlace = sequelize.define(
    "ItineraryPlace",
    {
        itineraryPlaceId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        itineraryId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        placeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        visitOrder: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        plannedTime: {
            type: DataTypes.TIME,
            allowNull: true
        }
    },
    {
        tableName: "itinerary_places",
        timestamps: false
    }
);

module.exports = ItineraryPlace;