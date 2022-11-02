import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import styles from './styles';

const DefaultButton = ({
  text = 'Botão',
  width = 300,
  height = 44,
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.buttonStyle,
        {
          width: width,
          height: height,
        },
      ]}>
      <View style={styles.buttonInside}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default DefaultButton;
