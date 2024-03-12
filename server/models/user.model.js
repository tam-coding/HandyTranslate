const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');
const User = sequelize.define('user', {
  user_name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin:{
    type: Sequelize.BOOLEAN,
    allowNull: false,
  }
});
sequelize.sync({}).then(() => {
  console.log('Tables users have been created!');
}).catch(err => {
  console.error('Error  creating users tables:', err);
});

module.exports = User;