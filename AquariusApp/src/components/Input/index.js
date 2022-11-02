import React from 'react';
import {SafeAreaView, TextInput, Text} from 'react-native';
import {COLOR_PLACEHOLDER} from '../../styles/Colors';
import styles from './styles';

const Input = ({setInputValue, inputValue, placeholder, label, help = ''}) => {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={setInputValue}
          value={inputValue}
          placeholder={placeholder}
          placeholderTextColor={COLOR_PLACEHOLDER}
        />
      </SafeAreaView>
      {help !== '' && <Text style={styles.help}>{help}</Text>}
    </>
  );
};

export default Input;
