import React from 'react';
import {View, Text, Image} from 'react-native';
import styles from './styles';
import Warning from '../../assets/warning.png';

const GenericError = props => {
  return (
    <View style={styles.container}>
      <Image source={Warning} style={{marginBottom: 16}} />
      <Text style={styles.text}>{props.message}</Text>
    </View>
  );
};

export default GenericError;
