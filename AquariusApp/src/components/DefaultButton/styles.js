import {StyleSheet} from 'react-native';
import {COLOR_BUTTON, COLOR_WHITE} from '../../styles/Colors';

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: 4,
    justifyContent: 'center',
    alignSelf: 'center',
    width: 50,
    backgroundColor: COLOR_BUTTON,
  },
  buttonInside: {
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: 15,
    color: COLOR_WHITE,

    letterSpacing: 0.46,
    textTransform: 'uppercase',
  },
});

export default styles;
