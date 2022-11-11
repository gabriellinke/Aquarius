import React, {useState, useEffect} from 'react';
import {View, ToastAndroid, Text} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Input from '../../components/Input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import InfoService from '../../services/InfoService';

const Home = () => {
  const [height, setHeight] = useState('');
  const [width, setWidth] = useState('');
  const [length, setLength] = useState('');
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

  const showToastSending = () => {
    ToastAndroid.show('Enviando...', ToastAndroid.SHORT);
  };

  useEffect(() => {
    async function loadSavedValues() {
      const savedHeight = await AsyncStorage.getItem('height');
      const savedLength = await AsyncStorage.getItem('length');
      const savedWidth = await AsyncStorage.getItem('width');
      const savedTemperature = await AsyncStorage.getItem('temperature');
      const savedPh = await AsyncStorage.getItem('ph');
      const savedStartTime = await AsyncStorage.getItem('startTime');
      const savedFinishTime = await AsyncStorage.getItem('finishTime');

      if (savedHeight) {
        setHeight(savedHeight);
      }
      if (savedLength) {
        setLength(savedLength);
      }
      if (savedWidth) {
        setWidth(savedWidth);
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
    if (height > 0 && width > 0 && length > 0) {
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

  const sendInfo = async () => {
    if (inputsAreValid()) {
      // POST

      const info = {
        altura: Number(height),
        largura: Number(width),
        comprimento: Number(length),
        temperatura: Number(temperature),
        ph: Number(ph),
        horaLigar: Number(startTime.split(':')[0]),
        minutoLigar: Number(startTime.split(':')[1]),
        horaDesligar: Number(finishTime.split(':')[0]),
        minutoDesligar: Number(finishTime.split(':')[1]),
      };
      showToastSending();
      InfoService.updateInfo(info)
        .then(async res => {
          if (res === 200) {
            await AsyncStorage.setItem('height', height);
            await AsyncStorage.setItem('width', width);
            await AsyncStorage.setItem('length', length);
            await AsyncStorage.setItem('temperature', temperature);
            await AsyncStorage.setItem('ph', ph);
            await AsyncStorage.setItem('startTime', startTime);
            await AsyncStorage.setItem('finishTime', finishTime);

            showToastSuccess();
          } else {
            showToastError();
          }
        })
        .catch(err => {
          console.log(err);
          showToastError();
        });
    } else {
      showToastError();
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{marginBottom: 16, marginTop: 32}}>
          <Text style={styles.label}>Dimensões do aquário (cm³)</Text>
          <View style={styles.inputContainer}>
            <Input
              inputValue={height}
              setInputValue={setHeight}
              width={88}
              keyboardType="numeric"
              label={'Altura'}
              placeholder={'20'}
            />
            <Input
              inputValue={width}
              setInputValue={setWidth}
              width={88}
              keyboardType="numeric"
              label={'Largura'}
              placeholder={'16'}
            />
            <Input
              inputValue={length}
              setInputValue={setLength}
              width={88}
              keyboardType="numeric"
              label={'Comprimento'}
              placeholder={'35'}
            />
          </View>
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
