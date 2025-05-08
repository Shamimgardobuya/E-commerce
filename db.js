require('dotenv').config();
console.log(process.env.DB_URI)
const Sequelize = require('sequelize')
// const  MariaDbDialect = require('@sequelize/mariadb');

const sequelize = new Sequelize(
    process.env.DB_URI
    , {dialect: 'postgres'})
module.exports = { sequelize }
async function testConnection() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }

  testConnection();
module.exports = {
  sequelize
}