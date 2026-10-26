const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const User = sequelize.define(
  "User",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    fullName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },

    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true
    },

    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },

    role: {
    type: DataTypes.ENUM("user", "admin"),
    allowNull: false,
    defaultValue: "user"
    },

    createdOn: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "users",
    timestamps: false
  }
);

module.exports = User;