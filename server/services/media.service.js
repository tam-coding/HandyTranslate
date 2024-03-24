const { TextTranslation, ImageTranslation, AudioTranslation } = require('../models/media.model');

class MediaService {
  async createTextTranslation({ from, to, source, target, userId }) {
    const textTranslation = await TextTranslation.create({ from, to, source, target, userId });
    console.log("textTranslation", textTranslation);
    return textTranslation.dataValues;
  }

  async getTextTranslations(pageNum, pageSize, userId) {
    const offset = (pageNum - 1) * pageSize;
    const limit = pageSize;
    const totalResult = await TextTranslation.findAll({ where: { userId: userId } });
    console.log("totalResult", totalResult.length);
    const total = totalResult.length;
    const result = await TextTranslation.findAll({
      where: { userId: userId },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    })
    return { records: result.map((item) => item.dataValues), total };
  }


  async deleteTextTranslationById(id) {
    return TextTranslation.destroy({
      where: {
        id: id
      }
    });
  }

  async createPicTrahslation({ userId, from, to, picUrl }) {
    const imageTranslation = await ImageTranslation.create({ userId, from, to, picUrl });
    return imageTranslation.dataValues;
  }

  async getPicTranslations(pageNum, pageSize, userId) {
    const offset = (pageNum - 1) * pageSize;
    const limit = pageSize;
    const totalResult = await ImageTranslation.findAll({ where: { userId: userId } });
    const total = totalResult.length;
    const result = await ImageTranslation.findAll({
      where: { userId: userId },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
      
    });
    return { records: result.map((item) => item.dataValues), total };
  }

  async createVoiceTranslation({ userId, targetLanguage, sourceLanguage, sourceText, targetText, target, source, position }) {
    const voiceTranslation = await AudioTranslation.create({ userId, targetLanguage, sourceLanguage, sourceText, targetText, target, source, position });
    return voiceTranslation.dataValues;
  }

  async getVoiceTranslations(pageNum, pageSize, userId) {
    const offset = (pageNum - 1) * pageSize;
    const limit = pageSize;

    const totalResult = await AudioTranslation.findAll({ where: { userId: userId } });
    const total = totalResult.length;

    const result = await AudioTranslation.findAll({
      where: { userId: userId },
      offset,
      limit,
      order: [['createdAt', 'DESC']],
    });

    return { records: result.map((item) => item.dataValues), total };

  }

}

module.exports = new MediaService();
