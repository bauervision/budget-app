/* eslint-disable react/prop-types */
import React, { Component } from "react";
import { Text, TextInput, View, Picker, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles";
import * as Colors from "../colors";

/**
 * This component renders a specific mode which will determine if the user increments, or decrements the budget
 * @param categories required prop which contains all the defined categories for this mode
 */
class Mode extends Component {
  state = {
    category: "",
    categories: [],
    funds: "",
    funds_temp: "",
    total: []
  };

  //incoming categories will update after the fetch, which will be after
  // this has mounted, so once they update, set the values to prevent
  // category undefined
  componentDidMount = () => {
    this.setState({
      categories: this.props.categories,
      category: this.props.categories[0]
    });
  };

  // grab categories to display for this budget mode
  updateCategory = (category) => {
    this.setState({ category: category });
  };

  handleNewAmount = (val) => {
    this.setState({ funds_temp: val, funds: 0 });
  };

  setNewAmount = () => {
    if (this.state.funds_temp === 0 || this.state.funds_temp === "") {
      alert("Please input a non-zero amount");
    } else {
      this.setState(
        {
          funds: this.state.funds_temp,
          funds_temp: ""
        },
        this.props.setVal(this.state.funds_temp, this.state.category)
      );
    }
  };

  formatMoney = (amount, decimalCount = 2, decimal = ".", thousands = ",") => {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    let i = parseInt(
      (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))
    ).toString();
    let j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - i)
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  };

  render() {
    const { funds, funds_temp, category } = this.state;
    const { text, categories, mode, customColors } = this.props;

    const money = this.formatMoney(funds);

    return (
      <View style={styles.modes}>
        <LinearGradient
          colors={
            mode === 1
              ? [customColors.EXPENSE.color, customColors.LOWLIGHT.color]
              : [customColors.INCOME.color, customColors.HIGHLIGHT.color]
          }
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center"
            }}
          >
            <Text style={styles.text}>{text}</Text>

            <View style={styles.picker}>
              <Picker
                selectedValue={category}
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
              value={funds_temp.toString()}
              keyboardType="numeric"
              placeholder="$ "
              onChangeText={this.handleNewAmount}
              style={styles.inputBudget}
              placeholderTextColor={customColors.FONTLIGHT.color}
            />
            <Text style={styles.text}>{money}</Text>
            <Button
              title={mode === 1 ? "Deduct" : "Add"}
              color={customColors.FONTLIGHT.color}
              accessibilityLabel="Add this value to calculation"
              onPress={this.setNewAmount}
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Mode;
