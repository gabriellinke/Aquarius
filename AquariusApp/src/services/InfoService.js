import getApi from './api';

class InfoService {
  async getInfo() {
    try {
      const api = await getApi();
      const response = await api.get('/');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return null;
    }
  }

  async turnLightOn() {
    try {
      const api = await getApi();
      const response = await api.post('/update-info', {estadoLuz: 'on'});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return null;
    }
  }
  async turnLightOff() {
    try {
      const api = await getApi();
      const response = await api.post('/update-info', {estadoLuz: 'off'});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return [];
    }
  }
  async dropAcid() {}
  async dropBase() {}
  async turnHeaterOn() {}
  async turnHeaterOff() {}
  async turnWaterPumpOn() {
    try {
      const api = await getApi();
      const response = await api.post('/update-info', {estadoBomba: 'on'});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return [];
    }
  }

  async turnWaterPumpOff() {
    try {
      const api = await getApi();
      const response = await api.post('/update-info', {estadoBomba: 'off'});
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return [];
    }
  }
}

export default new InfoService();
