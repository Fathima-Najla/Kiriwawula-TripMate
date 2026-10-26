const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const TouristPlaceFacility = sequelize.define(
    "TouristPlaceFacility",
    {
        placeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },

        facilityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        }
    },
    {
        tableName: "tourist_place_facilities",
        timestamps: false
    }
);

module.exports = TouristPlaceFacility;