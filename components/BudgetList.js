import React, { Component } from 'react';

import { View, FlatList, Text } from 'react-native';

import TouchableBtn from '../components/general/touchableBtn';
import styles from '../styles';
import { BasicBtn } from '../components/general/basicBtn';
import TallyModal from './TallyModal';

class BudgetList extends Component {
  state = {
    tallyVisible: false
  };

  toggleVisible = () => {
    console.log('total:', this.props.total);
    this.setState(state => {
      return {
        tallyVisible: !state.tallyVisible
      };
    });
  };

  render() {
    const { type, data, totalAmount, onRemove } = this.props;

    return (
      <View style={type === 1 ? styles.expenseColumn : styles.incomeColumn}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <TouchableBtn
              item={item}
              type={type}
              onRemove={onRemove}
              index={index}
            />
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

        <BasicBtn
          text={totalAmount}
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
          onPress={this.toggleVisible}
        />
      </View>
    );
  }
}

export default BudgetList;
