import React, { Component } from "react";

import { View, FlatList, Animated } from "react-native";

import TouchableBtn from "../components/general/touchableBtn";
import styles from "../styles";
import { BasicBtn } from "../components/general/basicBtn";

import * as Colors from "../colors";

class BudgetList extends Component {
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
          ref={(ref) => {
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
                textAlign: "center",
                color: "red",
                fontSize: 20,
                fontWeight: "bold"
              }
              : {
                textAlign: "center",
                color: "green",
                fontSize: 18,
                fontWeight: "bold"
              }
          }
          onPress={this.props.toggleTrend}
        />
      </View>
    );
  }
}

export default BudgetList;
