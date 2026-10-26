const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Category = sequelize.define(
    "Category",
    {
        categoryId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        categoryName: {
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
        tableName: "categories",
        timestamps: false
    }
);

module.exports = Category;