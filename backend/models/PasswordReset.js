
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const PasswordReset = sequelize.define(
    "PasswordReset",
    {
        resetId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tokenHash: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        usedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        tableName: "password_resets",
        timestamps: true,
    }
);

module.exports = PasswordReset;
