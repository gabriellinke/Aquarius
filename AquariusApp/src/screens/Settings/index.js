import React, {useState} from 'react';
import {View} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import styles from './styles';
import Input from '../../components/Input';

const Home = () => {
  const [dimensions, setDimensions] = useState('');
  const [temperature, setTemperature] = useState();
  const [ph, setPh] = useState();
  const [startTime, setStartTime] = useState();

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
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={temperature}
            setInputValue={setTemperature}
            label={'Temperatura desejada (ºC)'}
            placeholder={'25'}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={ph}
            setInputValue={setPh}
            label={'PH desejado'}
            placeholder={'7.0'}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={startTime}
            setInputValue={setStartTime}
            label={'Horário de ligar as luzes'}
            placeholder={'07:00'}
          />
        </View>
        <View style={{marginBottom: 16}}>
          <Input
            inputValue={startTime}
            setInputValue={setStartTime}
            label={'Horário de desligar as luzes'}
            placeholder={'18:35'}
          />
        </View>
      </View>
      <View style={{marginBottom: 72 + 32}}>
        <DefaultButton width={300} height={50} text={'enviar informações'} />
      </View>
    </View>
  );
};

export default Home;
