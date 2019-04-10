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
    modalVisible: false, // do we show the modal?
    modalCategory: '', //which category to display in the modal
    modalAmounts: [], // all the amounts for the modal
    modalReady: false, //trigger when modal has data
    totalExpenseCategoriesArray: {} // new object to store array of each category of expenses
  };

  handleSignUp = (email, password) => {
    console.log('Signing up new user:', email, ' + ', password);
    registerUser(email, password);
  };

  handleLogin = (email, password) => {
    // test account 'mike@gmail.com' 'password'
    console.log('Logging in user:', email, ' + ', password);
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
    this.setState({ loggedIn: false, loading: false });
  };

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
            0: 'Select...',
            1: 'Bills',
            2: 'Clothing',
            3: 'Gas',
            4: 'Coffee'
          };
          const incCats = {
            0: 'Select...',
            1: 'Salary',
            2: 'Sales',
            3: 'Tax Refund',
            4: 'Gift'
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
            displayed: true,
            loading: false // we're finally ready for next step
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

    this.setState({ totalExpenseCategoriesArray: tempArray });
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
    this.handleArraySeparation(category, val);

    console.log('Set New Income: category', category);
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

  hideModal = () => {};

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
                expenseTotal: 0
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

  render() {
    const {
      loggedIn,
      userId,
      loading,
      budgets,
      budgetName,
      incomeCategories,
      expenseCategories,
      incomeTotal,
      expenseTotal,
      Expenses,
      Incomes,
      totalExpenseCategoriesArray,
      modalVisible,
      modalAmounts,
      modalCategory,
      modalReady
    } = this.state;

    return (
      <View style={styles.container}>
        {/* Not currently logged in, so present log in options */}

        {!loggedIn ? (
          <LoginScreen signup={this.handleSignUp} login={this.handleLogin} />
        ) : (
          <View>
            {loading ? (
              // Still loading in data, show progress
              <UIActivityIndicator color="#009E05" />
            ) : (
              // data is loaded
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
                  />
                  <BudgetList
                    data={Incomes}
                    type={0}
                    totalAmount={incomeTotal}
                  />
                </View>

                <View style={styles.header}>
                  <LinearGradient colors={['#2b2b2b', Colors.darkGreen]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center'
                      }}
                    >
                      <Button
                        color={Colors.lightGreen}
                        title="SAVE "
                        onPress={this.handleSaveBudget}
                      />
                      <Button
                        color={Colors.darkGreen}
                        title="CLEAR "
                        onPress={this.handleClearBudget}
                      />
                    </View>
                  </LinearGradient>
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
        )}
      </View>
    );
  }
}
