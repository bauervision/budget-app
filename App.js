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
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Modal
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
import BudgetModal from './components/BudgetModal';

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
    Incomes: [],
    modalVisible: false, // do we show the modal?
    modalCategory: '', //which category to display in the modal
    modalAmounts: [], // all the amounts for the modal
    modalReady: false, //trigger when modal has data
    totalExpenseCategoriesArray: {} // new object to store array of each category of expenses
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

  modalVisiblity = visible => {
    this.setState({ modalVisible: visible });
  };

  setModalData = (amount, category) => {
    this.setState(
      state => {
        return {
          modalAmounts: state.modalAmounts.concat(amount),
          modalCategory: category
        };
      },
      () => {
        console.log(this.state.modalAmounts, ' & ', this.state.modalCategory);
        this.setState({ modalReady: true });
      }
    );
  };

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

  handleArraySeparation = (category, newAmount) => {
    const found = this.state.totalExpenseCategoriesArray.hasOwnProperty(
      category
    );

    const tempArray = this.state.totalExpenseCategoriesArray;

    // if the passed category is found in the state array
    if (found) {
      // push the new value
      tempArray[category].push(newAmount);
    } else {
      // otherwise, create a new category array, and start it with newAmount
      tempArray[category] = [newAmount];
    }

    this.setState(
      { totalExpenseCategoriesArray: tempArray },
      console.log('tempArray', this.state.totalExpenseCategoriesArray)
    );
  };

  setNewExpense = (val, category) => {
    this.handleArraySeparation(category, val);

    // create new object to store from passed data
    const newAmount = {
      amount: Number(val),
      category: category
    };

    // handle sequential state updates for basic calculations
    this.setState(
      state => {
        return {
          Expenses: state.Expenses.concat(newAmount) // push newAmount object into Expenses
        };
      },
      () => {
        //callback fires once state has mutated
        this.setState(
          {
            expenseAmounts: this.state.Expenses.map(({ amount }) => amount) //then map, pull out the amounts...
          },
          () => {
            this.setState({
              expenseTotal: this.state.expenseAmounts.reduce(
                (total, value) => total + value,
                0
              ) // and reduce the total
            });
          }
        );
      }
    );
  };

  setNewIncome = (val, category) => {
    // create new object to store
    const newAmount = {
      amount: Number(val),
      category: category
    };

    this.setState(
      state => {
        return {
          Incomes: state.Incomes.concat(newAmount) // push newAmount object into Expenses
        };
      },
      () => {
        //callback fires once state has mutated
        this.setState(
          {
            incomeAmounts: this.state.Incomes.map(({ amount }) => amount) //then map, pull out the amounts...
          },
          () => {
            this.setState({
              incomeTotal: this.state.incomeAmounts.reduce((a, b) => a + b, 0) // and reduce the total
            });
          }
        );
      }
    );
  };

  hideModal = () => {
    this;
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
      Incomes,
      modalVisible,
      modalAmounts,
      modalCategory,
      modalReady
    } = this.state;

    if (loading) {
      this.fetchData(0); // 0 for dev userId
    }

    const rowStyles = [
      styles.row,

      { opacity: this._animated },
      {
        transform: [
          { scale: this._animated },
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ['35deg', '0deg'],
              extrapolate: 'clamp'
            })
          }
        ]
      }
    ];

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
                    <Animated.View style={rowStyles}>
                      <TouchableOpacity
                        onPress={() => {
                          this.modalVisiblity(true);
                          if (item.amount) {
                            this.setModalData(item.amount, item.category);
                          }
                        }}
                      >
                        <View style={categories.groceries}>
                          <Text style={categories.expenseText}>
                            {item.category}
                          </Text>
                          <Text style={categories.expenseText}>
                            {item.amount}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </Animated.View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ref={ref => {
                    this.ExpenseFlatlistRef = ref;
                  }}
                  onContentSizeChange={() => {
                    this.ExpenseFlatlistRef.scrollToEnd({ animated: true });
                  }}
                  onLayout={() => {
                    this.ExpenseFlatlistRef.scrollToEnd({ animated: true });
                  }}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#a90329',
                    fontSize: 18,
                    fontWeight: 'bold'
                  }}
                >
                  {expenseTotal}
                </Text>
              </View>

              <View style={styles.incomeColumn}>
                <FlatList
                  data={Incomes}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      onPress={() => {
                        this.modalVisiblity(true);
                      }}
                    >
                      <View style={categories.salary}>
                        <Text style={categories.incomeText}>
                          {item.category}
                        </Text>
                        <Text style={categories.incomeText}>
                          {item.amount}{' '}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ref={ref => {
                    this.IncomeFlatlistRef = ref;
                  }}
                  onContentSizeChange={() => {
                    this.IncomeFlatlistRef.scrollToEnd({ animated: true });
                  }}
                  onLayout={() => {
                    this.IncomeFlatlistRef.scrollToEnd({ animated: true });
                  }}
                />

                <Text
                  style={{
                    textAlign: 'center',
                    color: '#009141',
                    fontSize: 18,
                    fontWeight: 'bold'
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

            {/* {modalReady && (
              <BudgetModal
                title={modalCategory}
                modalVisible={modalVisible}
                onDismiss={this.modalVisiblity}
                modalAmounts={modalAmounts}
              />
            )} */}
          </View>
        )}
      </View>
    );
  }
}
