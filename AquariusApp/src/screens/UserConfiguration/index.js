import React, {useState} from 'react';
import {View, Text, TextInput, Button} from 'react-native';
import InfoService from '../../services/InfoService';
import {useNavigation} from '@react-navigation/native';

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
    <View style={{backgroundColor: '#000'}}>
      <View>
        <Text>Configurações usuário</Text>
      </View>
    </View>
  );
};

export default Home;
