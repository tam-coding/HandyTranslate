const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');

const mediaData = sequelize.define('mediaData', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  pic: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  audio: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  text: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
});
sequelize.sync({}).then(() => {
  console.log('Tables users have been created!');
}).catch(err => {
  console.error('Error  creating users tables:', err);
});

module.exports = mediaData;