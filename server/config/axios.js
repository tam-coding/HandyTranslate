import axios from "axios";
const requests = axios.create({
  timeout: 20 * 1000,
});

requests.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';

requests.interceptors.request.use((config) => {
  config.headers = config.headers || {};
  return config;
}, error => {
  return Promise.reject(error);
});

requests.interceptors.response.use(
  response => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);
module.exports =requests;
