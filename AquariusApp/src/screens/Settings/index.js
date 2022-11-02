import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import InfoService from '../../services/InfoService';
import {useNavigation} from '@react-navigation/native';
import DefaultButton from '../../components/DefaultButton';
import {COLOR_BACKGROUND} from '../../styles/Colors';

const Home = () => {
  const [temperature, setTemperature] = useState(10);
  const [ph, setPh] = useState(7);
  const [ligthState, setLigthState] = useState('on');
  const {navigate} = useNavigation();

  const updateTemperature = async () => {
    let response = await InfoService.updateTemperature(temperature);
    console.log(response);
  };

  const updatePh = async () => {
    let response = await InfoService.updatePh(ph);
    console.log(response);
  };

  const updateLight = async () => {
    let response = await InfoService.updateLight(ligthState);
    console.log(response);
  };

  return (
    <View style={{backgroundColor: COLOR_BACKGROUND}}>
      <View>
        <Text>pH desejado:</Text>
        <TextInput
          onChangeText={setPh}
          value={ph}
          placeholder="Valor do pH"
          keyboardType="numeric"
        />
        <Button title="Alterar pH" onPress={() => updatePh()} />

        <Text>temperatura desejada:</Text>
        <TextInput
          onChangeText={setTemperature}
          value={temperature}
          placeholder="Valor da temperatura"
          keyboardType="numeric"
        />
        <Button
          title="Alterar temperatura"
          onPress={() => updateTemperature()}
        />

        <Text>estado luz:</Text>
        <TextInput
          onChangeText={setLigthState}
          value={ligthState}
          placeholder="Estado da lâmpada"
        />

        <DefaultButton width={300} height={50} text={'salvar informações'} />
      </View>
    </View>
  );
};

export default Home;
