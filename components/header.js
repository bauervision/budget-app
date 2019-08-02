/* eslint-disable react/prop-types */
import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  Image,
  Button,
  TouchableOpacity
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles";
// import * as Colors from "../colors";
import NameModal from "./NameModal";
import OptionsModal from "./OptionsModal";

import MenuIcon from "../assets/menu.png";

class Header extends Component {
  state = {
    visible: false,
    budgetName: "",
    optionsVisible: false
  };

  componentDidMount = () => {
    this.setState({ budgetName: this.props.budgetName });
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.budgetName !== this.props.budgetName) {
      this.setState({ budgetName: this.props.budgetName });
    }
  };

  handleNameChange = () => {
    this.setState((state) => {
      return {
        visible: !state.visible
      };
    });
  };

  handleOptions = () => {
    this.setState((state) => {
      return {
        optionsVisible: !state.optionsVisible
      };
    });
  };

  formatMoney = (
    amount = 0,
    decimalCount = 2,
    decimal = ".",
    thousands = ","
  ) => {
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
    const {
      expenses,
      income,
      saveName,
      logout,
      expenseCats,
      incomeCats,
      saveAllCategories,
      removeExp,
      removeInc,
      addNewBudget,
      setActive,
      customColors,
      updateCustomColor
    } = this.props;

    const funds = income - expenses;
    const money = this.formatMoney(funds);

    return (
      <View style={styles.header}>
        <LinearGradient
          colors={[customColors.PRIMARY.color, customColors.PRIMARY.color]}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={this.handleNameChange}
              style={{
                borderColor: "#606c88",
                borderWidth: 1,
                borderRadius: 5
              }}
            >
              <Text style={styles.text}>{this.state.budgetName}</Text>
            </TouchableOpacity>

            <Text style={styles.text}>Balance:</Text>
            <Text style={funds > 0 ? styles.posBalance : styles.negBalance}>
              ${money}
            </Text>

            <TouchableOpacity
              onPress={this.handleOptions}
              style={{
                borderColor: "#606c88",
                borderWidth: 1,
                borderRadius: 5
              }}
            >
              <Image source={MenuIcon} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <NameModal
          visible={this.state.visible}
          toggle={this.handleNameChange}
          budgetName={this.state.budgetName}
          setVal={saveName}
          allBudgets={this.props.allBudgets}
          addNewBudget={addNewBudget}
          setActive={setActive}
          customColors={customColors}
        />

        <OptionsModal
          visible={this.state.optionsVisible}
          toggle={this.handleOptions}
          logout={logout}
          expenseCats={expenseCats}
          incomeCats={incomeCats}
          saveAllCategories={saveAllCategories}
          removeExp={removeExp}
          removeInc={removeInc}
          customColors={customColors}
          updateCustomColor={updateCustomColor}
        />
      </View>
    );
  }
}

export default Header;
