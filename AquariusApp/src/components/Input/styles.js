import {StyleSheet} from 'react-native';
import {COLOR_INPUT, COLOR_LABEL, COLOR_INPUT_HELP} from '../../styles/Colors';

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: 300,
    borderWidth: 1,
    padding: 10,
    color: COLOR_INPUT,
  },
  label: {
    color: COLOR_LABEL,
    fontWeight: 'bold',
  },
  help: {
    color: COLOR_INPUT_HELP,
  },
});

export default styles;
