const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Media = sequelize.define(
    "Media",
    {
        mediaId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        placeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        mediaType: {
            type: DataTypes.ENUM("image", "video"),
            allowNull: false
        },

        mediaUrl: {
            type: DataTypes.STRING(500),
            allowNull: false
        }
    },
    {
        tableName: "media",
        timestamps: false
    }
);

module.exports = Media;