import React from 'react';
console.disableYellowBox = true;
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Animated,
  Button,
  FlatList
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

export default class App extends React.Component {
  state = {
    loggedIn: false,
    userId: 0,
    loading: true,
    budgets: [],
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

  fetchData = () => {
    const that = this;
    database
      .ref('budgets')
      .once('value')
      .then(function(snapshot) {
        const exists = snapshot.val() !== null;
        if (exists) {
          data = snapshot.val();
          const tempArray = data;
          that.setState({
            budgets: tempArray,
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
      newBudgetName_temp
    } = this.state;

    if (loading) {
      this.fetchData();
    }

    return (
      <View style={styles.container}>
        {loading ? (
          <WaveIndicator color="blue" />
        ) : (
          <View>
            <TextInput
              value={newBudgetName_temp}
              placeholder="Enter the name of a new budget"
              onChangeText={this.handleNewBudgetName}
              onEndEditing={this.setNewBudgetName}
              style={styles.inputBudget}
              placeholderTextColor={Colors.InputBright}
            />

            <Text style={styles.text}>New Budget Name: </Text>

            <FlatList
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
            />
          </View>
        )}
      </View>
    );
  }
}
