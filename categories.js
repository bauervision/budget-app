import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors';

const screenWidth = Dimensions.get('window').width;

export const categories = StyleSheet.create({
  expenseText: {
    color: 'red'
  },
  incomeText: {
    color: 'green'
  },
  groceries: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(200,0,0,0.2)',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 10,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRightWidth: 1,
    borderColor: 'red'
  },
  salary: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(0,200,0,0.2)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 1,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderLeftWidth: 1,
    borderColor: 'green'
  },
  utilities: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(220,0,0,0.5)'
  },
  clothing: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(200,0,0,0.5)'
  },
  gas: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(180,0,0,0.5)'
  },
  entertainment: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(160,0,0,0.5)'
  }
});

export default categories;
