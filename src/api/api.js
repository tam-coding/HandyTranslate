import requests from './index'

export const voiceTranslate = (data, headers) => requests({
  url: "/api/trans/v2/voicetrans",
  method: 'post',
  data,
  headers
});
export const pictureTranslate = (data) => requests({
  url: `/api/trans/sdk/picture`,
  method: 'post',
  data,

  headers: {
    "Content-Type": "multipart/form-data"
  }
});
export const textTranslate = (query) => requests({
  url: `/api/trans/vip/translate`,
  method: 'get',
  params: query,
});