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
  password: {
    type: Sequelize.STRING,
    allowNull: false
  },
  is_admin: {
    type: Sequelize.BOOLEAN,
    defaultValue: 0,
    comment: '是否为管理员, 0: 不是管理员(默认); 1: 是管理员',
  }
});
sequelize.sync({}).then(() => {
  console.log('Tables users have been created!');
}).catch(err => {
  console.error('Error  creating users tables:', err);
});

module.exports = User;