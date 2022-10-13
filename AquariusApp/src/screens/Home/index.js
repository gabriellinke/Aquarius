import React, {useEffect, useState} from 'react';
import {View, Text, Button} from 'react-native';
import InfoService from '../../services/InfoService';
import {useNavigation} from '@react-navigation/native';

const Home = ({navigation}) => {
  const [info, setInfo] = useState();
  const {navigate} = useNavigation();

  // Atualiza as informações toda vez que a tela é aberta
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      async function getInfo() {
        let data = await InfoService.getInfo();
        setInfo(data);
        console.log(data);
      }
      getInfo();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  // Atualiza as informações a cada 10 segundos
  // useEffect(() => {
  //   async function getInfo() {
  //     let data = await InfoService.getInfo();
  //     setInfo(data);
  //     console.log(data);
  //   }

  //   getInfo();

  // }, []);

  return (
    <View style={{backgroundColor: '#000'}}>
      {info ? (
        <View>
          <Text>
            A luz está {info.estadoLuz === 'on' ? 'ligada' : 'desligada'}
          </Text>
          <Text>O nível de água está {info.estadoNivelAgua}</Text>
          <Text>pH atual: {info.ph}</Text>
          <Text>pH desejado: {info.phDesejado}</Text>
          <Text>temperatura atual: {info.temperatura}</Text>
          <Text>temperatura desejada: {info.temperaturaDesejada}</Text>
        </View>
      ) : (
        <View>
          <Text>Não foi possível obter os parâmetros</Text>
        </View>
      )}
      <Button
        title="Ir para configurações"
        onPress={() => navigate('Configuration')}
      />
    </View>
  );
};

export default Home;
