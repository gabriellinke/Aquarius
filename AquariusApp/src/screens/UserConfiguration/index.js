import React, {useState} from 'react';
import {View, Text, ToastAndroid} from 'react-native';
import DefaultButton from '../../components/DefaultButton';
import Input from '../../components/Input';
import styles from './styles';
import DropDownPicker from 'react-native-dropdown-picker';

const Home = () => {
  const [espIP, setEspIP] = useState();
  const [weekDay, setWeekDay] = useState(null);
  const [time, setTime] = useState();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Segunda-feira', value: 'Segunda-feira'},
    {label: 'Terça-feira', value: 'Terça-feira'},
    {label: 'Quarta-feira', value: 'Quarta-feira'},
    {label: 'Quinta-feira', value: 'Quinta-feira'},
    {label: 'Sexta-feira', value: 'Sexta-feira'},
    {label: 'Sábado', value: 'Sábado'},
    {label: 'Domingo', value: 'Domingo'},
  ]);

  const showToastSuccess = () => {
    ToastAndroid.show(
      'Parâmetros atualizados com sucesso!',
      ToastAndroid.SHORT,
    );
  };

  const showToastError = () => {
    ToastAndroid.show('Erro ao atualizar parâmetros.', ToastAndroid.SHORT);
  };

  const saveInfo = () => {
    if (espIP) {
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
