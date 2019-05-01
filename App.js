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
  Modal,
  Alert
} from 'react-native';

import { LinearGradient } from 'expo';
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
import BudgetList from './components/BudgetList';
import LoginScreen from './LoginScreen';
import Images from './assets';
import { BasicBtn, ImageBtn } from './components/general/basicBtn';

import Graph from './Graph';

const screenWidth = Dimensions.get('window').width;

export default class App extends React.Component {
  state = {
    loggedIn: false,
    userId: '',
    loading: false,
    budgetsLoaded: false,
    budgets: [],
    budgetNumber: 0, // user can save multiple budgets if they want, which one is loaded?
    budgetName: '',
    expenseCategories: [], // selections
    incomeCategories: [],
    expenseAmounts: [], // amount values of all expenses
    incomeAmounts: [],
    incomeTotal: 0, // total of all incomes
    expenseTotal: 0,
    Expenses: [], // object array of all expenses
    Incomes: [],
    viewTally: false,
    totalExpenseCategoriesArray: {}, // new object to store array of each category of expenses
    totalIncomesCategoriesArray: {}, // new object to store array of each category of expenses
    allBudgetData: {}
  };

  colorAnim = new Animated.Value(0);

  componentDidMount() {
    this.handleLogin('mike@gmail.com', 'password');

    Animated.loop(
      Animated.timing(this.colorAnim, {
        toValue: 1,
        duration: 10000
      })
    ).start();
  }

  handleSignUp = (email, password) => {
    console.log('Signing up new user:', email, ' + ', password);
    registerUser(email, password);
  };

  handleLogin = (email, password) => {
    // test account 'mike@gmail.com' 'password'
    loginUserWithEmail(email.trim(), password.trim())
      .then(user => {
        this.setState(
          {
            loggedIn: true,
            userId: user.user.uid
          },
          () => {
            this.prepareUserData(this.state.userId);
          }
        );
      })
      .catch(() => {
        console.log('DEV unAUTH');
        this.setState({ loggedIn: false, loading: true });
      });
  };

  handleSignOut = () => {
    console.log('User has signed out');
    auth.signOut();
    this.setState({ loggedIn: false, loading: true });
  };

  prepareUserData = userId => {
    const that = this;

    //  check to see if this is a new user who will need default values setup
    const userRef = database.ref('user').child(userId);
    //fetch budgets...
    userRef
      .child('budgets')
      .child(that.state.budgetNumber)
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        // ... if exists, then this is not a new user
        if (exists) {
          console.log('Returning User Logging in!');
          data = snapshot.val();
          const tempArray = data;

          //now run through the data and pull out the goods

          // check to make sure data is valid before looping over it
          if (tempArray['expenses']) {
            tempArray['expenses'].forEach(element => {
              that.setNewExpense(Number(element.amount), element.category);
            });
          } else {
            console.log('No expenses found');
          }

          if (tempArray['incomes']) {
            tempArray['incomes'].forEach(element => {
              that.setNewIncome(Number(element.amount), element.category);
            });
          } else {
            console.log('No incomes found');
          }

          //then fetch user categories
          that.setState({ budgets: tempArray }, () =>
            that.fetchCategories(userId)
          );
        } else {
          console.log('New User Logging in!');
          // ...it doesnt exist, which means this is a new user
          const expCats = {
            0: 'Bills',
            1: 'Coffee',
            2: 'Clothing',
            3: 'Gas'
          };
          const incCats = {
            0: 'Salary',
            1: 'Gift',
            2: 'Sales',
            3: 'Tax Refund'
          };

          const newBudget = {
            0: {
              balance: 0,
              expenses: 0,
              incomes: 0,
              name: 'Budget 01'
            }
          };

          database.ref(`/user/${userId}/expenseTypes`).set(expCats);
          database.ref(`/user/${userId}/incomeTypes`).set(incCats);
          database.ref(`/user/${userId}/budgets`).set(newBudget);

          that.fetchCategories(userId);
        }
      })
      .catch(err => console.log(err));
  };

  fetchCategories = userId => {
    const that = this;

    const userRef = database.ref('user').child(userId);

    // grab all budget data while we're here
    userRef
      .child('budgets')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            allBudgetData: tempArray
          });
        }
      })
      .catch(err => console.log(err));

    // fetch expense categories
    userRef
      .child('budgets')
      .child(that.state.budgetNumber)
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            budgetName: tempArray['name']
          });
        }
      })
      .catch(err => console.log(err));

    // fetch expense categories
    userRef
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
      .child('incomeTypes')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            incomeCategories: tempArray,
            loading: false // we're finally ready for next step
          });
        }
      })
      .catch(err => console.log(err));
  };

  seperateExpenseArray = (category, newAmount) => {
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

    this.setState({ totalExpenseCategoriesArray: tempArray });
  };

  seperateIncomeArray = (category, newAmount) => {
    const found = this.state.totalIncomesCategoriesArray.hasOwnProperty(
      category
    );

    const tempArray = this.state.totalIncomesCategoriesArray;

    // if the passed category is found in the state array
    if (found) {
      // push the new value
      tempArray[category].push(newAmount);
    } else {
      // otherwise, create a new category array, and start it with newAmount
      tempArray[category] = [newAmount];
    }

    this.setState({ totalIncomesCategoriesArray: tempArray });
  };

  setNewExpense = (val, category) => {
    this.seperateExpenseArray(category, val);

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
    this.seperateIncomeArray(category, val);

    // create new object to store from passed data
    const newAmount = {
      amount: Number(val),
      category: category
    };

    // handle sequential state updates for basic calculations
    this.setState(
      state => {
        return {
          Incomes: state.Incomes.concat(newAmount) // push newAmount object into Incomes
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
              incomeTotal: this.state.incomeAmounts.reduce(
                (total, value) => total + value,
                0
              ) // and reduce the total
            });
          }
        );
      }
    );
  };

  handleClearBudget = () => {
    Alert.alert(
      'Clear Budget',
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Clear Budget'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.setState(
              {
                // clear the state
                Expenses: [],
                Incomes: [],
                incomeAmounts: [],
                expenseAmounts: [],
                incomeTotal: 0,
                expenseTotal: 0,
                totalExpenseCategoriesArray: [],
                totalIncomesCategoriesArray: []
              },
              () => this.clearDatabase()
            );
          }
        }
      ],
      { cancelable: false }
    );
  };

  clearDatabase = () => {
    database
      .ref(
        `/user/${this.state.userId}/budgets/${this.state.budgetNumber}/expenses`
      )
      .set([]);
    database
      .ref(
        `/user/${this.state.userId}/budgets/${this.state.budgetNumber}/incomes`
      )
      .set([]);
  };

  handleSaveBudget = () => {
    database
      .ref(
        `/user/${this.state.userId}/budgets/${this.state.budgetNumber}/expenses`
      )
      .set(this.state.Expenses);

    database
      .ref(
        `/user/${this.state.userId}/budgets/${this.state.budgetNumber}/incomes`
      )
      .set(this.state.Incomes);

    Alert.alert('Saving Budget to Database', 'Save Successful!', [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  handleSaveName = name => {
    this.setState({ budgetName: name });

    database
      .ref(`/user/${this.state.userId}/budgets/${this.state.budgetNumber}/name`)
      .set(name);

    Alert.alert(`Saving ${name} budget name to Database`, 'Save Successful!', [
      { text: 'OK', onPress: () => console.log('OK Pressed') }
    ]);
  };

  handleSaveNewCategories = (expenses, incomes) => {
    this.setState({
      expenseCategories: expenses,
      incomeCategories: incomes
    });

    database.ref(`/user/${this.state.userId}/expenseTypes`).set(expenses);
    database.ref(`/user/${this.state.userId}/incomeTypes`).set(incomes);
  };

  handleRemoveExpenseValue = index => {
    const tempArray = this.state.Expenses;

    tempArray.splice(index, 1); // remove 1 value at this index

    // handle sequential state updates for basic calculations
    this.setState(
      {
        Expenses: tempArray
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

  handleRemoveIncomeValue = index => {
    // handle sequential state updates for basic calculations

    const tempArray = this.state.Incomes;
    tempArray.splice(index, 1); // remove 1 value at this index

    this.setState(
      {
        Incomes: tempArray
      },
      () => {
        //callback fires once state has mutated
        this.setState(
          {
            incomeAmounts: this.state.Incomes.map(({ amount }) => amount) //then map, pull out the amounts...
          },
          () => {
            this.setState({
              incomeTotal: this.state.incomeAmounts.reduce(
                (total, value) => total + value,
                0
              ) // and reduce the total
            });
          }
        );
      }
    );
  };

  handleRemoveExpenseCategory = (index, category) => {
    //store state values
    const tempCategories = this.state.expenseCategories;
    const tempAmounts = this.state.Expenses;

    const updatedAmounts = tempAmounts.filter(
      elem => elem.category !== category
    );

    // create new array which doesnt contain the removed category
    const updatedCategories = tempCategories.filter(elem => elem !== category);

    // handle sequential state updates for basic calculations
    this.setState(
      {
        Expenses: updatedAmounts,
        expenseCategories: updatedCategories
      },
      () => {
        //callback fires once state has mutated
        // push update to database
        database
          .ref(`/user/${this.state.userId}/expenseTypes`)
          .set(updatedCategories);

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

  handleRemoveIncomeCategory = (index, category) => {
    const tempArray = this.state.incomeCategories;
    const tempAmounts = this.state.Incomes;

    const updatedAmounts = tempAmounts.filter(
      elem => elem.category !== category
    );

    // create new array which doesnt contain the removed category
    const updatedArray = tempArray.filter(elem => elem !== category);

    // handle sequential state updates for basic calculations
    this.setState(
      {
        Incomes: updatedAmounts,
        incomeCategories: updatedArray
      },
      () => {
        //callback fires once state has mutated
        database
          .ref(`/user/${this.state.userId}/incomeTypes`)
          .set(updatedArray);

        this.setState(
          {
            incomeAmounts: this.state.Incomes.map(({ amount }) => amount) //then map, pull out the amounts...
          },
          () => {
            this.setState({
              incomeTotal: this.state.incomeAmounts.reduce(
                (total, value) => total + value,
                0
              ) // and reduce the total
            });
          }
        );
      }
    );
  };

  toggleTrend = () => {
    this.setState(state => {
      return {
        viewTally: !state.viewTally
      };
    });
  };

  render() {
    const {
      loggedIn,
      loading,
      budgets,
      budgetName,
      incomeCategories,
      expenseCategories,
      incomeTotal,
      expenseTotal,
      Expenses,
      Incomes,
      viewTally
    } = this.state;

    let backgroundColor = this.colorAnim.interpolate({
      inputRange: [0, 0.35, 0.65, 1],
      outputRange: [Colors.bgAqua, Colors.bgPurple, Colors.bgRed, Colors.bgAqua]
    });

    return (
      <View style={styles.container}>
        {/* Not currently logged in, so present log in options */}
        {!loggedIn ? (
          <LoginScreen signup={this.handleSignUp} login={this.handleLogin} />
        ) : (
          <View>
            {viewTally ? (
              <Animated.View style={{ flex: 1, padding: 70, backgroundColor }}>
                <Graph visible={viewTally} toggle={this.toggleTrend} />
              </Animated.View>
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
                  budgetName={budgetName}
                  expenses={expenseTotal}
                  income={incomeTotal}
                  saveName={this.handleSaveName}
                  logout={this.handleSignOut}
                  expenseCats={expenseCategories}
                  incomeCats={incomeCategories}
                  saveAllCategories={this.handleSaveNewCategories}
                  removeExp={this.handleRemoveExpenseCategory}
                  removeInc={this.handleRemoveIncomeCategory}
                  allBudgets={this.state.allBudgetData}
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
                  <BudgetList
                    data={Expenses}
                    type={1}
                    totalAmount={expenseTotal}
                    onRemove={this.handleRemoveExpenseValue}
                    toggleTrend={this.toggleTrend}
                  />
                  <BudgetList
                    data={Incomes}
                    type={0}
                    totalAmount={incomeTotal}
                    onRemove={this.handleRemoveIncomeValue}
                    toggleTrend={this.toggleTrend}
                  />
                </View>

                <View style={styles.header}>
                  <LinearGradient colors={[Colors.darkGreen, Colors.darkGreen]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        alignItems: 'center'
                      }}
                    >
                      <ImageBtn
                        onPress={this.handleSaveBudget}
                        image={Images.Save}
                      />
                      <ImageBtn
                        onPress={this.handleClearBudget}
                        image={Images.Trash}
                      />
                    </View>
                  </LinearGradient>
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    );
  }
}
