import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Animated,
  Image,
  Button,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import Logo from './assets/logo.png';

import styles from './styles';
import * as Colors from './colors';
import Images from './assets';

class LoginScreen extends Component {
  state = {
    logIn: false,
    signup: false,
    email: '',
    email_temp: '',
    password: '',
    password_temp: ''
  };

  animation = new Animated.Value(0);
  colorAnim = new Animated.Value(0);

  onLogIn = () => {
    this.setState({
      login: true
    });
  };

  onSignUp = () => {
    this.setState({
      signup: true
    });
  };

  componentDidMount() {
    Animated.spring(this.animation, {
      toValue: 1,
      friction: 3,
      tension: 20
    }).start();

    Animated.loop(
      Animated.timing(this.colorAnim, {
        toValue: 1,
        duration: 2000
      })
    ).start();
  }

  goBack = () => {
    this.setState({
      login: false,
      signup: false
    });
  };

  handleEmail = email => {
    this.setState({
      email_temp: email
    });
  };

  handlePassword = password => {
    this.setState({
      password_temp: password
    });
  };

  setValuesToState = callback => {
    this.setState(
      state => {
        return {
          email: state.email_temp,
          password: state.password_temp
        };
      },
      () => {
        console.log('LogIn:', this.state.email, ' + ', this.state.password);
        callback(this.state.email, this.state.password);
      }
    );
  };

  login = () => {
    this.setValuesToState(this.props.login);
  };

  signup = () => {
    this.setValuesToState(this.props.signup);
  };

  render() {
    const animLogo = [
      { opacity: this.animation },
      {
        transform: [
          {
            translateY: this.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }
        ]
      }
    ];

    const animButtons = [
      { opacity: this.animation },
      {
        transform: [
          {
            translateY: this.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [200, 0]
            })
          }
        ]
      }
    ];

    const {
      login,
      signup,
      email,
      email_temp,
      password,
      password_temp
    } = this.state;

    let borderTopColor = this.colorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [Colors.lightGreen, Colors.navyBlue, Colors.lightGreen]
    });

    let borderBottomColor = this.colorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [Colors.navyBlue, Colors.lightGreen, Colors.navyBlue]
    });

    return (
      <KeyboardAvoidingView
        behavior="position"
        enabled
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <View style={styles.centered}>
          <Animated.Image source={Images.Logo} style={animLogo} />
        </View>

        <Animated.View
          style={[
            animButtons,
            {
              borderRadius: 10,
              borderTopWidth: 1,
              borderTopColor,
              borderBottomWidth: 1,
              borderBottomColor,
              padding: 50
            }
          ]}
        >
          {!signup && (
            <Animated.View style={login && styles.loginView}>
              {login && (
                <View>
                  <View>
                    <TouchableOpacity onPress={this.goBack}>
                      <Animated.Image source={Images.BackBtn} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.text}>Email</Text>
                  <TextInput
                    value={email_temp.toString()}
                    placeholder="Enter your email"
                    onChangeText={this.handleEmail}
                    style={styles.inputBudget}
                    placeholderTextColor={Colors.navyBlue}
                  />
                  <Text style={styles.text}>Password</Text>
                  <TextInput
                    value={password_temp.toString()}
                    placeholder="Enter your password"
                    onChangeText={this.handlePassword}
                    style={styles.inputBudget}
                    placeholderTextColor={Colors.navyBlue}
                  />
                </View>
              )}

              <View>
                <TouchableOpacity
                  onPress={!login ? this.onLogIn : this.login}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 5,
                    justifyContent: 'space-evenly'
                  }}
                >
                  <Text style={styles.text}>Log In!</Text>
                  <Image source={Images.Login} />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {!login && (
            <View style={signup && styles.loginView}>
              {signup && (
                <View>
                  <View>
                    <TouchableOpacity onPress={this.goBack}>
                      <Animated.Image source={Images.BackBtn} />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.text}>Email</Text>
                  <TextInput
                    value={email_temp.toString()}
                    placeholder="Enter your email"
                    onChangeText={this.handleEmail}
                    style={styles.inputBudget}
                    placeholderTextColor={Colors.navyBlue}
                  />
                  <Text style={styles.text}>Password</Text>
                  <TextInput
                    value={password_temp.toString()}
                    placeholder="Enter your password"
                    onChangeText={this.handlePassword}
                    style={styles.inputBudget}
                    placeholderTextColor={Colors.navyBlue}
                  />
                </View>
              )}

              <View>
                <TouchableOpacity
                  onPress={!signup ? this.onSignUp : this.signup}
                  style={{
                    flexDirection: 'row',
                    marginTop: 5,
                    justifyContent: 'space-between'
                  }}
                >
                  <Image source={Images.Signup} />
                  <Text style={styles.text}>Sign Up!</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }
}

export default LoginScreen;
