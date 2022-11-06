import React, {useState, useEffect} from 'react';
import {View, Text, ToastAndroid} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import Input from '../../components/Input';
import styles from './styles';
import DropDownPicker from 'react-native-dropdown-picker';
import {otherParametersNotification} from '../../services/notification';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Home = () => {
  const [espIP, setEspIP] = useState();
  const [weekDay, setWeekDay] = useState(null);
  const [time, setTime] = useState();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Segunda-feira', value: 1},
    {label: 'Terça-feira', value: 2},
    {label: 'Quarta-feira', value: 3},
    {label: 'Quinta-feira', value: 4},
    {label: 'Sexta-feira', value: 5},
    {label: 'Sábado', value: 6},
    {label: 'Domingo', value: 0},
  ]);

  useEffect(() => {
    async function loadSavedValues() {
      const savedEspIP = await AsyncStorage.getItem('espIP');
      const savedWeekDay = await AsyncStorage.getItem('weekDay');
      const savedTime = await AsyncStorage.getItem('time');

      if (savedEspIP) {
        setEspIP(savedEspIP);
      }
      if (savedWeekDay) {
        setWeekDay(+savedWeekDay);
      }
      if (savedTime) {
        setTime(savedTime);
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

  // Pega o Date da próxima notificação
  function getNextDate(dayIndex) {
    let today = new Date();
    let [hours, minutes] = time.split(':');

    let nextDate = new Date();
    nextDate.setHours(hours);
    nextDate.setMinutes(minutes);

    // Se o dia da semana de hoje é o mesmo da notificação, verifica o horário da notificação. Se já passou no dia de hoje,
    // agenda a notificação para semana que vem, senão, agenda para hoje
    if (today.getDay() == dayIndex) {
      console.log(nextDate.getTime(), today.getTime());
      if (nextDate.getTime() < today.getTime()) {
        nextDate.setDate(
          nextDate.getDate() + ((dayIndex - 1 - nextDate.getDay() + 7) % 7) + 1,
        );
      }
    } else {
      nextDate.setDate(
        nextDate.getDate() + ((dayIndex - 1 - nextDate.getDay() + 7) % 7) + 1,
      );
    }

    return nextDate;
  }

  const inputsAreValid = () => {
    if (!time || time.indexOf(':') < 0) {
      return false;
    }
    if (!espIP || espIP.length < 0 || espIP.indexOf('.') < 0) {
      return false;
    }
    const ipArray = espIP.split('.');
    if (ipArray.length <= 3) {
      return false;
    }
    const [hours, minutes] = time.split(':');
    if (weekDay === null || hours < 0 || minutes < 0) {
      return false;
    }
    return true;
  };

  const saveInfo = async () => {
    if (inputsAreValid()) {
      // Programa as notificações
      const notificationDate = getNextDate(weekDay, time);
      await otherParametersNotification(notificationDate);

      // Salva as informações no async storage
      await AsyncStorage.setItem('espIP', espIP);
      await AsyncStorage.setItem('weekDay', `${weekDay}`);
      await AsyncStorage.setItem('time', time);

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
            label={'IP do ESP32'}
            placeholder={'xxx.xxx.xxx.xxx'}
            help={'Exemplo: 192.168.0.1'}
            mask={'ip'}
          />
        </View>

        <View style={{marginBottom: 16, width: 300}}>
          <Text style={styles.label}>Dia da semana da notificação</Text>
          <DropDownPicker
            open={open}
            value={weekDay}
            items={items}
            setOpen={setOpen}
            setValue={setWeekDay}
            setItems={setItems}
            style={{borderRadius: 0}}
            maxHeight={500}
            placeholder="Selecione o dia da semana"
          />
        </View>

        <View style={{marginBottom: 16}}>
          <Input
            inputValue={time}
            setInputValue={setTime}
            label={'Horário da notificação'}
            placeholder={'20:15'}
            mask={'time'}
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
