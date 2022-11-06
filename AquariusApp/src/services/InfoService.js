import axios from 'axios';

class InfoService {
  async getInfo() {
    try {
      const api = axios.create({
        baseURL: 'https://api.nossoolharsolidario.com.br', // URL para acessar o ESP32
      });

      console.log('RUNNING');
      const response = await api.get('/api/items');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to get info.', error);
      return [];
    }
  }

  async updateTemperature(temperature) {
    try {
      const response = await api.post('/update-info', {
        temperatura: temperature,
      });
      return response.data;
    } catch (error) {
      console.log('Failed to update temperature', error);
      return [];
    }
  }

  async updatePh(ph) {
    try {
      const response = await api.post('/update-info', {
        ph,
      });
      return response.data;
    } catch (error) {
      console.log('Failed to update pH', error);
      return [];
    }
  }

  async updateLight(lightState) {
    try {
      const response = await api.post('/update-info', {
        estadoLuz: lightState,
      });
      return response.data;
    } catch (error) {
      console.log('Failed to update light state', error);
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
