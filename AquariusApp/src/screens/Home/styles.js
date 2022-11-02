import {StyleSheet} from 'react-native';
import {COLOR_BACKGROUND, COLOR_INFO_TEXT} from '../../styles/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR_BACKGROUND,
    flexGrow: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  infoText: {
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: 20,
    color: COLOR_INFO_TEXT,
  },
});

export default styles;
