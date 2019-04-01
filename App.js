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
    expenses: [],
    incomes: [],
    incomeTotal: 0,
    expenseTotal: 0
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
            expenses: snapshot.val(),
            expenseTotal: snapshot.val().reduce((a, b) => a + b, 0)
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
            incomes: snapshot.val(),
            incomeTotal: snapshot.val().reduce((a, b) => a + b, 0)
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

  setNewExpense = val => {
    // merge state
    this.setState(
      () => {
        this.setState(state => {
          return {
            expenses: state.expenses.concat(Number(val))
          };
        });
      },
      () => {
        this.setState(
          {
            expenseTotal: this.state.expenses.reduce(
              (total, amount) => total + amount
            )
          },
          () => {
            console.log(
              'expenses',
              this.state.expenses,
              'expenseTotal',
              this.state.expenseTotal
            );
          }
        );
      }
    );
  };

  setNewIncome = val => {
    // merge state
    this.setState(
      () => {
        this.setState(state => {
          return {
            incomes: state.incomes.concat(Number(val))
          };
        });
      },
      () => {
        this.setState(
          {
            incomeTotal: this.state.incomes.reduce(
              (total, amount) => total + amount
            )
          },
          () => {
            console.log(
              'incomes',
              this.state.incomes,
              'incomeTotal',
              this.state.incomeTotal
            );
          }
        );
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
      expenses,
      incomes,
      incomeTotal,
      expenseTotal
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

            <View style={{ flex: 3, flexDirection: 'row' }}>
              <View style={styles.expenseColumn}>
                <Text style={{ textAlign: 'center', color: '#a90329' }}>
                  {expenseTotal}
                </Text>
                <FlatList
                  style={{ marginTop: 20 }}
                  data={expenses}
                  renderItem={({ item, index }) => (
                    <Text style={styles.text}>{item} </Text>
                    // <TouchableBtn key={index} id={item} />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>

              <View style={styles.incomeColumn}>
                <Text style={{ textAlign: 'center', color: '#009141' }}>
                  {incomeTotal}
                </Text>

                <FlatList
                  style={{ marginTop: 20 }}
                  data={incomes}
                  renderItem={({ item, index }) => (
                    <Text style={styles.text}>{item} </Text>
                    // <TouchableBtn key={index}  id={item.id}  />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}
