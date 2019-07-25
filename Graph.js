import React, { Component } from "react";
import { Text, View, Animated, Image, TouchableOpacity } from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { Svg, Line, Polyline } from "react-native-svg";

import styles from "./styles";
import * as Colors from "./colors";
import Images from "./assets";

class Graph extends Component {
  state = {
    isReady: false
  };
  colorAnim = new Animated.Value(0);
  loadAnim = new Animated.Value(0);

  componentDidMount() {
    const { budgetCount } = this.props;

    Animated.timing(this.loadAnim, {
      toValue: 1,
      duration: 500
    }).start();

    Animated.loop(
      Animated.timing(this.colorAnim, {
        toValue: 1,
        duration: 4000
      })
    ).start();

    // check to make sure we have enough data to draw graph
    if (budgetCount > 1) {
      this.setState({ isReady: true });
    }
  }

  goBack = () => {
    Animated.timing(this.loadAnim, {
      toValue: 0,
      duration: 500
    }).start(() => this.props.toggle());
  };

  render() {
    const { isReady } = this.state;

    const { budgetCount, balanceData, expenseData, incomeData } = this.props;
    const max = 300;
    const months = budgetCount;

    const interval = max / months;

    const monthsLine = (range) =>
      Array.from({ length: range }, (v, i) => i * interval);

    const xline = monthsLine(months);

    const ylineIncome = incomeData;
    const ylineExpenses = expenseData;
    // calculate balance from income and expense difference
    const ylineBalance = balanceData;

    const newGlobalArray = [...ylineIncome, ...ylineExpenses, ...ylineBalance];
    var absMax = newGlobalArray.reduce(function(max, item) {
      return Math.max(Math.abs(max), Math.abs(item));
    });

    const minMaxNorm = (array) => {
      let norm;
      for (let i = 0; i < array.length; i++) {
        norm = (array[i] / absMax) * 150;
        array[i] = norm;
      }
    };

    const invertValue = (value) => {
      return value * -1 + 150;
    };

    const invertArrayValue = (array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = invertValue(array[i]);
      }
    };

    //now find the values in the data
    minMaxNorm(ylineIncome);
    minMaxNorm(ylineBalance);
    minMaxNorm(ylineExpenses);
    invertArrayValue(ylineIncome);
    invertArrayValue(ylineExpenses);
    invertArrayValue(ylineBalance);

    // format data for the lines
    const balance = [];
    for (let i = 0; i < xline.length; i++) {
      const val = `${xline[i]},${ylineBalance[i]}`;
      balance.push(val);
    }

    const income = [];
    for (let i = 0; i < xline.length; i++) {
      const val = `${xline[i]},${ylineIncome[i]}`;
      income.push(val);
    }

    const expenses = [];
    for (let i = 0; i < xline.length; i++) {
      const val = `${xline[i]},${ylineExpenses[i]}`;
      expenses.push(val);
    }

    let borderColor = this.colorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [Colors.lightGreen, Colors.navyBlue, Colors.lightGreen]
    });

    let pageLoad = [];

    if (this.props.visible) {
      pageLoad = [
        { opacity: this.loadAnim },
        {
          transform: [
            { scale: this.loadAnim },
            {
              translateY: this.loadAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [500, 0]
              })
            },

            {
              rotate: this.loadAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ["35deg", "0deg"]
              })
            }
          ]
        }
      ];
    }

    const graphMessage = isReady
      ? `Balance trend for (${months}) saved budgets`
      : "Not enough data yet to display trend. Need at least 2 saved budgets.";

    const gradientColors = isReady
      ? ["transparent", "green", "transparent", "red", "transparent"]
      : [
        "transparent",
        "transparent",
        "transparent",
        "transparent",
        "transparent"
      ];

    return (
      <Animated.View
        style={[
          pageLoad,
          {
            flex: 1,
            justifyContent: "center",
            alignItems: "center"
          }
        ]}
      >
        <TouchableOpacity onPress={this.goBack}>
          <LinearGradient
            colors={gradientColors}
            start={[0, 0.2]}
            end={[0, 0.8]}
          >
            <View>
              <TouchableOpacity onPress={this.goBack}>
                <Animated.Image source={Images.BackBtn} />
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text
                style={{
                  color: "cyan",
                  fontSize: 18,
                  borderBottomColor: "cyan",
                  borderBottomWidth: 1
                }}
              >
                {graphMessage}
              </Text>
            </View>

            {isReady && (
              <View>
                <Animated.View
                  style={{
                    marginTop: 40,
                    borderRadius: 10,
                    borderColor,
                    borderWidth: 1
                  }}
                >
                  <Svg height="300" width="300">
                    {/* Zero line */}
                    <Line
                      x1="0"
                      y1="150"
                      x2="300"
                      y2="150"
                      stroke="#2f3a4c"
                      strokeWidth="1"
                    />

                    {/* Map over and create vertical lines based on number of months */}
                    {monthsLine(months).map((line, i) => (
                      <Line
                        key={i}
                        x1={line}
                        y1="0"
                        x2={line}
                        y2="300"
                        stroke="#2f3a4c"
                        strokeWidth="1"
                      />
                    ))}

                    <Polyline
                      points={balance}
                      fill="none"
                      stroke="cyan"
                      strokeWidth="3"
                    />

                    <Polyline
                      points={income}
                      fill="none"
                      stroke="green"
                      strokeWidth="2"
                    />
                    <Polyline
                      points={expenses}
                      fill="none"
                      stroke="red"
                      strokeWidth="2"
                    />
                  </Svg>
                </Animated.View>
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text style={{ color: "green", margin: 10 }}>Income</Text>
                  <Text style={{ color: "red", margin: 10 }}>Expenses</Text>
                  <Text style={{ color: "cyan", margin: 10 }}>Balance</Text>
                </View>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default Graph;
