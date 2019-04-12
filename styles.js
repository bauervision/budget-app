import { StyleSheet, Dimensions } from 'react-native';
import * as Colors from './colors';

const screenWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    width: screenWidth,
    paddingTop: 20,
    backgroundColor: '#2b2b2b',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  text: {
    color: '#ddd',
    textAlign: 'center',
    padding: 10,
    fontSize: 15
  },
  posBalance: {
    backgroundColor: 'white',
    color: 'green',
    textAlign: 'center',
    padding: 10,
    fontSize: 17,
    fontWeight: 'bold'
  },
  negBalance: {
    backgroundColor: 'white',
    color: 'red',
    textAlign: 'center',
    padding: 10,
    fontSize: 17,
    fontWeight: 'bold'
  },
  budgetName: {
    color: Colors.DarkText
  },
  inputBudget: {
    color: Colors.DarkText,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    margin: 10
  },
  header: {
    width: screenWidth,
    height: 50,
    // padding: 20,
    marginTop: 5
  },
  modes: {
    flex: 1,
    padding: 10,
    marginBottom: 5,
    width: screenWidth,
    height: 40
  },
  picker: {
    backgroundColor: 'grey',
    width: '50%',
    height: 40,
    borderRadius: 7,
    fontSize: 14
  },
  expenseColumn: {
    flex: 1
  },
  incomeColumn: {
    flex: 1
  },
  button: {
    color: 'white',
    borderRadius: 10
  },
  loginView: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.navyBlue,
    borderRadius: 20,
    width: '100%'
  }
});

export default styles;
