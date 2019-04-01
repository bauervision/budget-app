import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors';

const screenWidth = Dimensions.get('window').width;

export const categories = StyleSheet.create({
  groceries: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(200,0,0,0.2)',
    borderRadius: 10,
    margin: 5
  },
  salary: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15,
    backgroundColor: 'rgba(0,200,0,0.2)',
    borderRadius: 10,
    margin: 5
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
