const { Sequelize } = require('sequelize');
const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB } = process.env

const sequelize = new Sequelize(MYSQL_DB, MYSQL_USER, MYSQL_PASSWORD, {
  host: MYSQL_HOST,
  dialect: 'mysql',
  underscored: true,
  timezone: '+08:00' ,
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
  }
});

module.exports = {
  sequelize: sequelize,
};
