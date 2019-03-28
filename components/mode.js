import React, { Component } from 'react';
import { Text, TextInput, View, Picker, Button } from 'react-native';
import { LinearGradient } from 'expo';
import styles from '../styles';
import * as Colors from '../colors';

class Mode extends Component {
  state = {
    funds: 0,
    funds_temp: 0,
    category: 'Select a type...'
  };

  updateCategory = category => {
    this.setState({ category: category });
  };

  handleFundsChange = val => {
    this.setState({ funds_temp: val });
  };

  setFunds = () => {
    this.setState({
      funds: this.state.funds_temp,
      funds_temp: 0
    });
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
    const { funds, funds_temp } = this.state;

    const { text, categories, mode } = this.props;

    const money = this.formatMoney(funds);

    return (
      <View style={styles.modes}>
        <LinearGradient
          colors={
            mode === 1
              ? ['#a90329', '#B20306', '#6d0019']
              : ['#009141', '#009E05', '#006e2e']
          }
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center'
            }}
          >
            <Text style={styles.text}>{text}</Text>
            <View style={styles.picker}>
              <Picker
                selectedValue={this.state.category}
                onValueChange={this.updateCategory}
                mode="dropdown"
              >
                {categories.map((cat, index) => {
                  return <Picker.Item key={index} label={cat} value={cat} />;
                })}
              </Picker>
            </View>
          </View>

          <View>
            <TextInput
              value={funds_temp}
              keyboardType="numeric"
              placeholder="$ "
              onChangeText={this.handleFundsChange}
              onEndEditing={this.setFunds}
              style={styles.inputBudget}
              placeholderTextColor={Colors.InputBright}
            />
            <Text>{money}</Text>
            <Button
              title="Add"
              color={Colors.BoxGreyBlue}
              accessibilityLabel="Add this value to calculation"
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Mode;
