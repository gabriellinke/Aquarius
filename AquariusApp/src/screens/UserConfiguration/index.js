import React, {useState, useEffect} from 'react';
import {View, ToastAndroid} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import Input from '../../components/Input';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [espIP, setEspIP] = useState();

  useEffect(() => {
    async function loadSavedValues() {
      const savedEspIP = await AsyncStorage.getItem('espIP');

      if (savedEspIP) {
        setEspIP(savedEspIP);
      }
    }
    loadSavedValues();
  }, []);

  const showToastSuccess = () => {
    ToastAndroid.show(
      'Parâmetros atualizados com sucesso!',
      ToastAndroid.SHORT,
    );
  };

  const showToastError = () => {
    ToastAndroid.show('Erro ao atualizar parâmetros.', ToastAndroid.SHORT);
  };

  const inputsAreValid = () => {
    if (!espIP || espIP.length < 0 || espIP.indexOf('.') < 0) {
      return false;
    }
    const ipArray = espIP.split('.');
    if (ipArray.length <= 3) {
      return false;
    }
    return true;
  };

  const saveInfo = async () => {
    if (inputsAreValid()) {
      // Salva as informações no async storage
      await AsyncStorage.setItem('espIP', espIP);
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
            inputValue={espIP}
            setInputValue={setEspIP}
            label={'IP do Mexilhãozinho'}
            placeholder={'xxx.xxx.xxx.xxx'}
            help={'Exemplo: 192.168.0.1'}
            mask={'ip'}
          />
        </View>
      </View>
      <View style={{marginBottom: 72 + 32}}>
        <DefaultButton
          onPress={() => saveInfo()}
          width={300}
          height={50}
          text={'salvar informações'}
        />
      </View>
    </View>
  );
};

export default Home;
