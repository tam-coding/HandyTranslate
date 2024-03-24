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
export const sendEmailCode = (email) => requests({
  url: `/users/sendEmailCode?email=${email}`,
  method: 'get',
});
// user_name, password, email, code, is_admin
export const register = (data) => requests({
  url: `/users/register`,
  method: 'post',
  data
});

// email password
export const login = (data) => requests({
  url: `/users/login`,
  method: 'post',
  data
});

export const refreshToken = ({refreshToken}) => requests({
  url: `/users/refreshToken?refreshToken=${refreshToken}`,
  method: 'get',
});


export const textTran = (query) => requests({
  url: `/translate/textTranslate`,
  method: 'get',
  params: query,
});

export const getTextHistory = (pageNum,pageSize) => requests({
  url: `/translate/getTextHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
  method: 'get',
});

export const deleteTextById = (id) => requests({
  url: `/translate/deleteTextById/${id}`,
  method: 'delete',
});

export const pictureTran = (data) => requests({
  url: `/translate/picTranslate`,
  method: 'post',
  data,
  headers: {
    "Content-Type": "multipart/form-data"
  }
});

export const getPicHistory = (pageNum,pageSize) => requests({
  url: `/translate/getPicHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
  method: 'get',
});

export const voiceTran = (data, headers) => requests({
  url: "/translate/audioTranslate",
  method: 'post',
  data,
  headers
});

export const getAudioHistory = (pageNum,pageSize) => requests({
  url: `/translate/getAudioHistory?pageNum=${pageNum}&pageSize=${pageSize}`,
  method: 'get',
});