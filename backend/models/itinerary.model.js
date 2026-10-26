const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Itinerary = sequelize.define(
    "Itinerary",
    {
        itineraryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        itineraryName: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        travelDate: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        createdOn: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "itineraries",
        timestamps: false
    }
);

module.exports = Itinerary;