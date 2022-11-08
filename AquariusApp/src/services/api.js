import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getApi() {
  const espIp = await AsyncStorage.getItem('espIP');
  const api = axios.create({
    baseURL: `http://${espIp}`, // URL para acessar o ESP32
  });

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

  return api;
}
