import React from 'react';
import { View, Text, TextInput } from 'react-native';

import styles from '../../styles';
import * as Colors from '../../colors';

const SignInForm = ({ handleEmail, handlePassword }) => {
  let email_temp = '';
  let password_temp = '';

  return (
    <View>
      <Text style={styles.text}>Email</Text>
      <TextInput
        value={email_temp.toString()}
        placeholder="Enter your email"
        onChangeText={handleEmail}
        style={styles.inputBudget}
        placeholderTextColor={Colors.navyBlue}
      />
      <Text style={styles.text}>Password</Text>
      <TextInput
        value={password_temp.toString()}
        placeholder="Enter your password"
        onChangeText={handlePassword}
        style={styles.inputBudget}
        placeholderTextColor={Colors.navyBlue}
      />
    </View>
  );
};

export default SignInForm;
