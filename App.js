import React from 'react';
console.disableYellowBox = true;
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Button,
  FlatList,
  Dimensions,
  ScrollView
} from 'react-native';
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator
} from 'react-native-indicators';
///////////////////////////////////////////////////////
import { f, auth, database, storage } from './utils/config';
import { registerUser, loginUserWithEmail } from './utils/auth';
import { fetchOnce, fetchAndOrderOnce } from './utils/api/database';

import styles from './styles';
import * as Colors from './colors';

/////////////////////////////////////////////////////
import TouchableBtn from './components/general/touchableBtn';
import Mode from './components/mode';
import Header from './components/header';

const screenWidth = Dimensions.get('window').width;

export default class App extends React.Component {
  state = {
    loggedIn: false,
    userId: 0,
    loading: true,
    budgets: [],
    expenseCategories: [],
    incomeCategories: [],
    displayed: false,
    newBudgetName: '',
    newBudgetName_temp: ''
  };

  _animated = new Animated.Value(0);

  componentDidMount() {
    //registerUser('mike@gmail.com', 'password');
    loginUserWithEmail('mike@gmail.com', 'password')
      .then(user => {
        this.setState({
          loggedIn: true,
          userId: user.user.uid,
          loading: false
        });
      })
      .catch(() => {
        console.log('DEV unAUTH');
        this.setState({ loggedIn: false, loading: true });
      });

    // set animation
    Animated.timing(this._animated, {
      toValue: 1,
      duration: 250
    }).start();
  }

  fetchData = userId => {
    const that = this;

    const userRef = database.ref('user').child(userId);
    //fetch budget data
    userRef
      .child('budgets')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            budgets: tempArray
          });
        }
      })
      .catch(err => console.log(err));

    // fetch expense categories
    userRef
      .child('categories')
      .child('expenseTypes')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            expenseCategories: tempArray
          });
        }
      })
      .catch(err => console.log(err));

    //fetch income categories
    userRef
      .child('categories')
      .child('incomeTypes')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            incomeCategories: tempArray,
            displayed: true,
            loading: false
          });
        }
      })
      .catch(err => console.log(err));
  };

  handleNewBudgetName = val => {
    this.setState({ newBudgetName_temp: val });
  };

  setNewBudgetName = () => {
    this.setState({
      newBudgetName: this.state.newBudgetName_temp,
      newBudgetName_temp: ''
    });

    // merge state
    this.setState(prevState => {
      const newBudget = {
        id: prevState.newBudgetName,
        income: 0,
        expenses: 0,
        balance: 0
      };

      return {
        budgets: prevState.budgets.concat(newBudget)
      };
    });
  };

  handlePress = val => {
    alert('Pressed: budget ', val);
  };

  render() {
    const {
      loggedIn,
      loading,
      budgets,
      displayed,
      newBudgetName,
      newBudgetName_temp,
      incomeCategories,
      expenseCategories
    } = this.state;

    if (loading) {
      this.fetchData(0);
    }

    return (
      <View style={styles.container}>
        {loading ? (
          <UIActivityIndicator color="#009E05" />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'flex-start'
            }}
          >
            <Header />

            <ScrollView
              horizontal={true}
              decelerationRate={'normal'}
              snapToInterval={screenWidth}
              snapToAlignment={'center'}
              showsHorizontalScrollIndicator={false}
            >
              <Mode
                text="Add New Expense"
                categories={expenseCategories}
                mode={1}
              />
              <Mode
                text="Add New Income"
                categories={incomeCategories}
                mode={0}
              />
            </ScrollView>

            <View style={{ flex: 3, flexDirection: 'row' }}>
              <View style={styles.expenseColumn}>
                <Text style={{ textAlign: 'center', color: '#a90329' }}>
                  Expenses
                </Text>
              </View>

              <View style={styles.incomeColumn}>
                <Text style={{ textAlign: 'center', color: '#009141' }}>
                  Income
                </Text>
              </View>
            </View>
            {/* 
            <TextInput
              value={newBudgetName_temp}
              placeholder="Enter the name of a new budget"
              onChangeText={this.handleNewBudgetName}
              onEndEditing={this.setNewBudgetName}
              style={styles.inputBudget}
              placeholderTextColor={Colors.InputBright}
            />

            <Text style={styles.text}>New Budget Name: </Text> */}

            {/* <FlatList
              style={{ marginTop: 20 }}
              data={budgets}
              renderItem={({ item, index }) => (
                <TouchableBtn
                  key={index}
                  id={item.id}
                  onPress={this.handlePress}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
            /> */}
          </View>
        )}
      </View>
    );
  }
}
