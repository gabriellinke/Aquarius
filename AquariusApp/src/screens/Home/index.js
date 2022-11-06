import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import InfoService from '../../services/InfoService';
import styles from './styles';
import GenericError from '../../components/GenericError';
import DefaultButton from '../../components/DefaultButton';
import {otherParametersNotification} from '../../services/notification';

const Home = ({navigation}) => {
  const [info, setInfo] = useState();

  // Atualiza as informações toda vez que a tela é aberta
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      // async function getInfo() {
      //   let data = await InfoService.getInfo();
      //   setInfo(data);
      //   console.log(data);
      // }
      // getInfo();
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
    <View style={styles.container}>
      {!info ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.infoText}>Temperatura atual: 20ºC</Text>
          <Text style={styles.infoText}>PH atual: 6.8</Text>
        </View>
      ) : (
        <View>
          <GenericError
            message={
              'Ops! Você ainda não cadastrou o IP do ESP32. Acesse as configurações de usuário.'
            }
          />
          {/* <GenericError
            message={
              'Ops! Houve um problema de comunicação. Verifique sua conexão e a do ESP32.'
            }
          /> */}
        </View>
      )}
      <DefaultButton
        onPress={async () => await InfoService.getInfo()}
        width={300}
        height={50}
        text={'mostrar notificação'}
      />
    </View>
  );
};

export default Home;
