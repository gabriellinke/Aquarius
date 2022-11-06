import React, {useState, useEffect} from 'react';
import {View, ToastAndroid} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Input from '../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [dimensions, setDimensions] = useState('');
  const [temperature, setTemperature] = useState();
  const [ph, setPh] = useState();
  const [startTime, setStartTime] = useState();
  const [finishTime, setFinishTime] = useState();

  const showToastSuccess = () => {
    ToastAndroid.show(
      'Parâmetros atualizados com sucesso!',
      ToastAndroid.SHORT,
    );
  };

  const showToastError = () => {
    ToastAndroid.show('Erro ao atualizar parâmetros.', ToastAndroid.SHORT);
  };

  const sending = () => {
    ToastAndroid.show('Enviando...', ToastAndroid.SHORT);
  };

  useEffect(() => {
    async function loadSavedValues() {
      const savedDimensions = await AsyncStorage.getItem('dimensions');
      const savedTemperature = await AsyncStorage.getItem('temperature');
      const savedPh = await AsyncStorage.getItem('ph');
      const savedStartTime = await AsyncStorage.getItem('startTime');
      const savedFinishTime = await AsyncStorage.getItem('finishTime');

      if (savedDimensions) {
        setDimensions(savedDimensions);
      }
      if (savedTemperature) {
        console.log(savedTemperature);
        setTemperature(savedTemperature);
      }
      if (savedPh) {
        console.log(savedPh);
        setPh(savedPh);
      }
      if (savedStartTime) {
        setStartTime(savedStartTime);
      }
      if (savedFinishTime) {
        setFinishTime(savedFinishTime);
      }
    }
    loadSavedValues();
  }, []);

  function inputsAreValid() {
    return (
      dimensionsAreValid() &&
      temperatureIsValid() &&
      phIsValid() &&
      timesAreValid()
    );
  }

  function dimensionsAreValid() {
    if (dimensions.length > 0 && dimensions.split('x').length === 3) {
      return true;
    }
    return false;
  }

  function temperatureIsValid() {
    if (temperature && temperature >= 20 && temperature <= 50) {
      return true;
    }
    return false;
  }

  function phIsValid() {
    if (ph && ph >= 4.5 && ph <= 9) {
      return true;
    }
    return false;
  }

  function timesAreValid() {
    if (
      startTime &&
      startTime.indexOf(':') > 0 &&
      finishTime &&
      finishTime.indexOf(':') > 0
    ) {
      return true;
    }
    return false;
  }

  function calculateVolume() {
    const values = dimensions.split('x');
    return +values[0] * +values[1] * +values[2];
  }

  const sendInfo = async () => {
    if (inputsAreValid()) {
      // POST
      // if(post.error)
      // showToastError();

      // Salva as informações no async storage
      await AsyncStorage.setItem('dimensions', dimensions);
      await AsyncStorage.setItem('temperature', temperature);
      await AsyncStorage.setItem('ph', ph);
      await AsyncStorage.setItem('startTime', startTime);
      await AsyncStorage.setItem('finishTime', finishTime);

      showToastSuccess();
    } else {
      showToastError();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{marginBottom: 16, marginTop: 32}}>
          <Input
            inputValue={dimensions}
            setInputValue={setDimensions}
            label={'Dimensões do aquário (cm³)'}
            placeholder={'100x50x20'}
            help={'Exemplo: 50x30x20'}
            mask={'dimension'}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={temperature}
            setInputValue={setTemperature}
            label={'Temperatura desejada (ºC)'}
            placeholder={'25'}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={ph}
            setInputValue={setPh}
            label={'PH desejado'}
            placeholder={'7.0'}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={startTime}
            setInputValue={setStartTime}
            label={'Horário de ligar as luzes'}
            placeholder={'07:00'}
            mask={'time'}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={finishTime}
            setInputValue={setFinishTime}
            label={'Horário de desligar as luzes'}
            placeholder={'18:35'}
            mask={'time'}
          />
        </View>
      </View>
      <View style={{marginBottom: 72 + 32}}>
        <DefaultButton
          onPress={() => sendInfo()}
          width={300}
          height={50}
          text={'enviar informações'}
        />
      </View>
    </View>
  );
};

export default Home;
