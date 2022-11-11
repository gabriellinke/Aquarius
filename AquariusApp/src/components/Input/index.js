import React from 'react';
import {SafeAreaView, TextInput, Text, View} from 'react-native';
import {COLOR_PLACEHOLDER} from '../../styles/Colors';
import styles from './styles';

const Input = ({
  setInputValue,
  inputValue,
  placeholder,
  label,
  width = 300,
  help = '',
  mask = '',
  ...rest
}) => {
  const handleInput = input => {
    let value;
    if (mask === 'ip') {
      value = ipMask(input);
    } else if (mask === 'dimension') {
      value = dimensionMask(input);
    } else if (mask === 'time') {
      value = timeMask(input);
    } else {
      value = input;
    }
    setInputValue(value);
  };

  const ipMask = value => {
    value = value.replace(/[^\.0-9-]+/, '');

    return value;
  };

  const timeMask = value => {
    value = value.replace(/[^\dh:]/, '');
    value = value.replace(/^[^0-2]/, '');
    value = value.replace(/^([2-9])[4-9]/, '$1');
    value = value.replace(/^\d[:h]/, '');
    value = value.replace(/^([01][0-9])[^:h]/, '$1');
    value = value.replace(/^(2[0-3])[^:h]/, '$1');
    value = value.replace(/^(\d{2}[:h])[^0-5]/, '$1');
    value = value.replace(/^(\d{2}h)./, '$1');
    value = value.replace(/^(\d{2}:[0-5])[^0-9]/, '$1');
    value = value.replace(/^(\d{2}:\d[0-9])./, '$1');
    return value;
  };

  const dimensionMask = value => {
    value = value.replace(/[^x-x0-9-]+/, '');

    return value;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <SafeAreaView>
        <TextInput
          style={[styles.input, {width: width}]}
          onChangeText={handleInput}
          value={inputValue}
          placeholder={placeholder}
          placeholderTextColor={COLOR_PLACEHOLDER}
          {...rest}
        />
      </SafeAreaView>
      {help !== '' && <Text style={styles.help}>{help}</Text>}
    </View>
  );
};

export default Input;
