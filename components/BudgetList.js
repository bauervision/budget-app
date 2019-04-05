import React, { Component } from 'react';

import { View, FlatList, Text } from 'react-native';

import TouchableBtn from '../components/general/touchableBtn';
import styles from '../styles';

class BudgetList extends Component {
  render() {
    const { type, data, totalAmount } = this.props;

    return (
      <View style={type === 1 ? styles.expenseColumn : styles.incomeColumn}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <TouchableBtn item={item} type={type} />
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
          style={
            type === 1
              ? {
                  textAlign: 'center',
                  color: 'red',
                  fontSize: 20,
                  fontWeight: 'bold'
                }
              : {
                  textAlign: 'center',
                  color: 'green',
                  fontSize: 18,
                  fontWeight: 'bold'
                }
          }
        >
          {totalAmount}
        </Text>
      </View>
    );
  }
}

export default BudgetList;
