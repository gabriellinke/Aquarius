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
      return [];
    }
  }

  async turnLightOn() {}
  async turnLightOff() {}
  async dropAcid() {}
  async dropBase() {}
  async turnHeaterOn() {}
  async turnHeaterOff() {}
  async turnWaterPumpOn() {}
  async turnWaterPumpOff() {}
}

export default new InfoService();
