import React, { Component } from 'react';
import { Text, TextInput, View, Picker, Button } from 'react-native';
import { LinearGradient } from 'expo';
import styles from '../styles';
import * as Colors from '../colors';

class Header extends Component {
  state = {
    funds: 1234,

    category: 'Select a type...'
  };

  formatMoney = (amount, decimalCount = 2, decimal = '.', thousands = ',') => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : '') +
      i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : '')
    );
  };

  render() {
    const { funds } = this.state;

    const money = this.formatMoney(funds);

    return (
      <View style={styles.header}>
        <LinearGradient colors={['#515872', '#606c88', '#515872']}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}
          >
            <Text style={styles.text}>Balance:</Text>
            <Text style={styles.posBalance}>${money}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Header;
