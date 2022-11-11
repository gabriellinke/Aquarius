import {StyleSheet} from 'react-native';
import {COLOR_BACKGROUND, COLOR_LABEL} from '../../styles/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BACKGROUND,
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  label: {
    color: COLOR_LABEL,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
