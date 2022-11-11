/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import InfoService from '../../services/InfoService';
import styles from './styles';
import GenericError from '../../components/GenericError';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = ({navigation}) => {
  const [info, setInfo] = useState();
  const [espRegistered, setEspRegistered] = useState(true);

  // Atualiza as informações toda vez que a tela é aberta
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      // Verifica se o IP do ESP32 está cadastrado
      const espIp = await AsyncStorage.getItem('espIP');
      setEspRegistered(!!espIp);
      // Atualiza informações
      const data = await InfoService.getInfo();
      setInfo(data);
      console.log(data);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      {info ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={
              styles.infoText
            }>{`Temperatura atual: ${info.temperatura}ºC`}</Text>
          <Text style={styles.infoText}>{`PH atual: ${info.ph}`}</Text>
        </View>
      ) : (
        <View>
          {espRegistered ? (
            <GenericError
              message={
                'Ops! Houve um problema de comunicação. Verifique sua conexão e a do ESP32.'
              }
            />
          ) : (
            <GenericError
              message={
                'Ops! Você ainda não cadastrou o IP do ESP32. Acesse as configurações de usuário.'
              }
            />
          )}
        </View>
      )}
    </View>
  );
};

export default Home;
