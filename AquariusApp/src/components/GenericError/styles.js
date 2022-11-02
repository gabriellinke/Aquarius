import {StyleSheet} from 'react-native';
import {COLOR_ALERT_TEXT} from '../../styles/Colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '70%',
  },
  text: {
    fontFamily: 'Roboto',
    color: COLOR_ALERT_TEXT,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default styles;
