const { Sequelize } = require("sequelize");
const config = require("../config/config.json");

const dbConfig = config.development;

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect
  }
);

sequelize.authenticate()
  .then(() => {
    console.log("MySQL database connected successfully!");
  })
  .catch((error) => {
    console.error("Unable to connect to MySQL:", error);
  });

module.exports = sequelize;