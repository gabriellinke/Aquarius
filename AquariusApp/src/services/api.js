import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.113', // URL para acessar o ESP32
});
console.log('Create');

api.interceptors.request.use(
  function (request) {
    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export default api;
