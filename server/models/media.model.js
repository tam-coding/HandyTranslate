const Sequelize = require('sequelize');
const { sequelize } = require('../config/sequelize');
const User = require('./user.model')

const ImageTranslation = sequelize.define('ImageTranslation', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  picUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },

});

ImageTranslation.belongsTo(User, { foreignKey: 'userId' });

const AudioTranslation = sequelize.define('AudioTranslation', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  source: {
    type: Sequelize.TEXT('long'),
    allowNull: false,
  },
  sourceText: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  targetText: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  targetLanguage: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sourceLanguage: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  position: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  target: {
    type: Sequelize.TEXT('long'),
    allowNull: false,
  },
});

AudioTranslation.belongsTo(User, { foreignKey: 'userId' });

const TextTranslation = sequelize.define('TextTranslation', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  from: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  to: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  source: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  target: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  id: {
    type: Sequelize.STRING,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4 ,
    allowNull: false,
  },
});

TextTranslation.belongsTo(User, { foreignKey: 'userId' });

sequelize.sync({}).then(() => {
  console.log('Tables ImageTranslation, AudioTranslation, TextTranslation have been created!');
}).catch(err => {
  console.error('Error creating translation tables:', err);
});

module.exports = {
  ImageTranslation,
  AudioTranslation,
  TextTranslation
};
