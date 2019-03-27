import { StyleSheet } from 'react-native';
import * as Colors from './colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  budgetBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    height: 60,
    backgroundColor: Colors.BoxGreyBlue,
    borderRadius: 20,
    margin: 10
  },
  text: {
    color: 'white',
    textAlign: 'center'
  },
  budgetName: {
    color: Colors.DarkText
  },
  inputBudget: {
    color: Colors.DarkText,
    backgroundColor: Colors.BoxGreyBlue,
    padding: 10,
    borderRadius: 10,
    margin: 10
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    height: 60
  }
});

export default styles;
