const axios = require('axios');
const { createTextTranslation, getTextTranslations,
  deleteTextTranslationById, createPicTrahslation,
  getPicTranslations, createVoiceTranslation,
  getVoiceTranslations } = require('../services/media.service')
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;
const { textDeleteError, textTranError, picTranError,audioTranError } = require('../constants/err.type')
const fs = require('fs');
const path = require('path')


class Translate {

  async textTran(ctx, next) {
    console.log("ctx.query", ctx.query)
    try {
      let result = await axios.get('https://fanyi-api.baidu.com/api/trans/vip/translate', {
        params: ctx.query
      })
      console.log("result", result.data);
      const { authorization = "" } = ctx.request.headers;
      const token = authorization.replace('Bearer ', '');
      console.log("token", token);
      const decodedToken = await jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      console.log("userId", userId);
      const textItem = {
        "from": result.data.from,
        "to": result.data.to,
        "source": result.data.trans_result[0].src,
        "target": result.data.trans_result[0].dst,
        "userId": userId
      }
      const res = await createTextTranslation(textItem)
      console.log("res", res);
      ctx.body = {
        code: 0,
        message: "文本翻译成功",
        result: res
      };
    } catch (error) {
      console.log("文本翻译失败", error);
      ctx.app.emit('error', textTranError, ctx)
    }

  }

  async deleteTextTranslationById(ctx, next) {
    const { id } = ctx.params;
    console.log("deleteTextTranslationById", id);
    try {
      await deleteTextTranslationById(id)
      ctx.body = {
        code: 0,
        message: "删除成功",
      }
    } catch (error) {
      console.log("deleteTextTranslationById错误", error);
      ctx.app.emit('error', textDeleteError, ctx)
    }


  }

  async getTextHistorage(ctx, next) {
    const { pageNum, pageSize } = ctx.request.query;

    const { authorization = "" } = ctx.request.headers;
    const token = authorization.replace('Bearer ', '');
    const decodedToken = await jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.id;
    try {
      const result = await getTextTranslations(pageNum * 1, pageSize * 1, userId)
      // console.log("getTextHistorage",result);
      ctx.body = {
        code: 0,
        message: "获取历史记录成功",
        result: result
      }
    } catch (error) {
      console.log("error", error);
    }
  }

  async picTran(ctx, next) {
    const file = ctx.request.files.picUrl
    const serverUrl = ctx.request.origin; // 获取服务器地址，例如：http://localhost:3000
    const picUrl = `${serverUrl}:3002/upload/${file.newFilename}`;

    const { from, to } = ctx.request.body
    try {
      const { authorization = "" } = ctx.request.headers;
      const token = authorization.replace('Bearer ', '');
      const decodedToken = await jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      const result = await createPicTrahslation({ userId, from, to, picUrl })
      console.log("result", result);
      ctx.body = {
        code: 0,
        message: "图片翻译成功",
        result: result
      }

    } catch (error) {
      console.log("图片翻译失败", error);
      ctx.app.emit('error', picTranError, ctx)
    }

  }

  async getPicHistorage(ctx, next) {
    const { pageNum, pageSize } = ctx.request.query;
    try {
      const { authorization = "" } = ctx.request.headers;
      const token = authorization.replace('Bearer ', '');
      const decodedToken = await jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      const result = await getPicTranslations(pageNum * 1, pageSize * 1, userId);
      ctx.body = {
        code: 0,
        message: "获取图片翻译历史记录成功",
        result: result
      };
    } catch (error) {
      console.log("获取图片翻译历史记录失败", error);
    }
  }

  async audioTran(ctx, next) {
    const { targetLanguage, sourceLanguage, sourceText, targetText, target, source, position } = ctx.request.body
    try {
      const { authorization = "" } = ctx.request.headers;
      const token = authorization.replace('Bearer ', '');
      const decodedToken = await jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      const result = await createVoiceTranslation({ userId,targetLanguage, sourceLanguage, sourceText, targetText, target, source, position })
      console.log("result", result);
      console.log("targetLanguage",targetLanguage);
      console.log("sourceLanguage",sourceLanguage);
      console.log("sourceText",sourceText);
      console.log("targetText",targetText);
      // console.log("target",target);
      // console.log("source",source);
      console.log("position",position);
      ctx.body = {
        code: 0,
        message: "音频翻译成功",
        result: result
      }
    } catch (error) {
      ctx.app.emit('error', audioTranError, ctx)
      console.log("音频翻译失败", error);
    }
  }

  async getAudioHistorage(ctx, next) {
    const { pageNum, pageSize } = ctx.request.query;
    try {
      const { authorization = "" } = ctx.request.headers;
      const token = authorization.replace('Bearer ', '');
      const decodedToken = await jwt.verify(token, JWT_SECRET);
      const userId = decodedToken.id;
      const result = await getVoiceTranslations(pageNum * 1, pageSize * 1, userId);
      ctx.body = {
        code: 0,
        message: "获取语音翻译历史记录成功",
        result: result
      };
    } catch (error) {
      console.log("获取语音翻译历史记录失败", error);
    }
  }

}
module.exports = new Translate();

