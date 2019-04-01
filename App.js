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
import categories from './categories';

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
    expenseCategories: [], // selections
    incomeCategories: [],
    expenseAmounts: [], // amount values of all expenses
    incomeAmounts: [],
    incomeTotal: 0, // total of all incomes
    expenseTotal: 0,
    Expenses: [], // object array of all expenses
    Incomes: []
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

    // fetch expense data
    userRef
      .child('budgets')
      .child(userId) // TODO fetch based on selected budget, not userId
      .child('expense')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          that.setState({
            Expenses: snapshot.val(), // store entire object array
            expenseAmounts: snapshot.val().map(({ amount }) => amount), // map over the object and pull out the amounts
            expenseTotal: snapshot
              .val()
              .map(({ amount }) => amount) //then map, pull out the amounts...
              .reduce((a, b) => a + b, 0) // and reduce the total
          });
        }
      })
      .catch(err => console.log(err));

    // fetch income data
    userRef
      .child('budgets')
      .child(userId) // TODO fetch based on selected budget, not userId
      .child('income')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          that.setState({
            Incomes: snapshot.val(), // store entire object array
            incomeAmounts: snapshot.val().map(({ amount }) => amount), // map over the object and pull out the amounts
            incomeTotal: snapshot
              .val()
              .map(({ amount }) => amount) //then map, pull out the amounts...
              .reduce((a, b) => a + b, 0) // and reduce the total
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

  setNewExpense = (val, category) => {
    // create new object to store
    const newAmount = {
      amount: Number(val),
      category: category
    };

    // merge state
    this.setState(
      () => {
        this.setState(state => {
          return {
            Expenses: state.Expenses.concat(newAmount) // push newAmount object into Expenses
          };
        });
      },
      () => {
        this.setState({
          expenseAmounts: this.state.Expenses.map(({ amount }) => amount) //then map, pull out the amounts...
        });
      },
      () => {
        this.setState({
          expenseTotal: this.state.expenses.reduce((a, b) => a + b, 0) // and reduce the total
        });
      }
    );
  };

  setNewIncome = val => {
    // create new object to store
    const newAmount = {
      amount: Number(val),
      category: category
    };

    // merge state
    this.setState(
      () => {
        this.setState(state => {
          return {
            Incomes: state.Incomes.concat(newAmount) // push newAmount object into Expenses
          };
        });
      },
      () => {
        this.setState({
          incomeAmounts: this.state.Incomes.map(({ amount }) => amount) //then map, pull out the amounts...
        });
      },
      () => {
        this.setState({
          incomeTotal: this.state.expenses.reduce((a, b) => a + b, 0) // and reduce the total
        });
      }
    );
  };

  render() {
    const {
      loggedIn,
      loading,
      budgets,
      incomeCategories,
      expenseCategories,
      incomeTotal,
      expenseTotal,
      Expenses,
      Incomes
    } = this.state;

    if (loading) {
      this.fetchData(0); // 0 for dev userId
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
            <Header
              budget={budgets}
              expenses={expenseTotal}
              income={incomeTotal}
            />

            <ScrollView
              horizontal={true}
              decelerationRate={'normal'}
              snapToInterval={screenWidth}
              snapToAlignment={'center'}
              showsHorizontalScrollIndicator={false}
            >
              <Mode
                text="New Expense"
                categories={expenseCategories}
                mode={1}
                setVal={this.setNewExpense}
              />
              <Mode
                text="New Income"
                categories={incomeCategories}
                mode={0}
                setVal={this.setNewIncome}
              />
            </ScrollView>

            <View style={{ flex: 2, flexDirection: 'row' }}>
              <View style={styles.expenseColumn}>
                <FlatList
                  data={Expenses}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly'
                      }}
                    >
                      <Text style={categories.groceries}>{item.category} </Text>
                      <Text style={categories.groceries}>{item.amount} </Text>
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ref={ref => {
                    this.myFlatListRef = ref;
                  }}
                  onContentSizeChange={() => {
                    this.myFlatListRef.scrollToEnd({ animated: true });
                  }}
                  onLayout={() => {
                    this.myFlatListRef.scrollToEnd({ animated: true });
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#a90329',
                    fontSize: 16
                  }}
                >
                  {expenseTotal}
                </Text>
              </View>

              <View style={styles.incomeColumn}>
                <FlatList
                  data={Incomes}
                  renderItem={({ item, index }) => (
                    <Text style={categories.salary}>{item.amount} </Text>
                    // <TouchableBtn key={index}  id={item.id}  />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ref={ref => {
                    this.myFlatListRef = ref;
                  }}
                  onContentSizeChange={() => {
                    this.myFlatListRef.scrollToEnd({ animated: true });
                  }}
                  onLayout={() => {
                    this.myFlatListRef.scrollToEnd({ animated: true });
                  }}
                />

                <Text
                  style={{
                    textAlign: 'center',
                    color: '#009141',
                    fontSize: 16
                  }}
                >
                  {incomeTotal}
                </Text>
              </View>
            </View>

            <View style={{ paddingVertical: 5 }}>
              {/* <Button title="SAVE BUDGET" /> */}
              <Text>Save Budget</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}
