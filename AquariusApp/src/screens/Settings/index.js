import React, {useState} from 'react';
import {View, ToastAndroid} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Input from '../../components/Input';

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

  const sendInfo = () => {
    if (temperature > 20) {
      sending();
      setTimeout(() => {
        showToastSuccess();
      }, 200);
    } else {
      sending();
      setTimeout(() => {
        showToastError();
      }, 200);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={{marginBottom: 16, marginTop: 32}}>
          <Input
            inputValue={dimensions}
            setInputValue={setDimensions}
            label={'Dimensões do aquário'}
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
