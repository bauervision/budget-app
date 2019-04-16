import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Animated,
  Image,
  Button,
  TouchableOpacity
} from 'react-native';

import { Svg, LinearGradient } from 'expo';

const { Line, Polyline } = Svg;

import styles from './styles';
import * as Colors from './colors';
import Images from './assets';

class Graph extends Component {
  colorAnim = new Animated.Value(0);
  componentDidMount() {
    Animated.loop(
      Animated.timing(this.colorAnim, {
        toValue: 1,
        duration: 4000
      })
    ).start();
  }

  render() {
    const max = 300;
    const months = 4;

    const interval = max / months;

    const monthsLine = range =>
      Array.from({ length: range }, (v, i) => i * interval);

    const xline = monthsLine(months);

    const normalize = val => {
      return (val - 0) / (100 - 0);
    };

    // const ylineIncome = [
    //   normalize(1100),
    //   normalize(1800),
    //   normalize(900),
    //   normalize(1600)
    // ];

    const ylineIncome = [110, 110, 90, 80];
    const ylineExpenses = [130, 100, 70, 95];
    const ylineBalance = [130, 160, 170, 135];

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

    // for each value, determine if its < or = or > than 150
    // convert those numbers accordingly
    // fill the data

    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            'transparent',
            Colors.darkGreen,
            'transparent',
            Colors.ExpenseRed,
            'transparent'
          ]}
          start={[0, 0.2]}
          end={[0, 0.8]}
        >
          <Text style={{ color: 'cyan' }}>{ylineIncome[0]}</Text>
          <Animated.View
            style={{
              marginTop: 40,
              borderRadius: 10,
              borderColor,
              borderWidth: 1
            }}
          >
            {/* {xline.map(val => (
          <Text style={{ color: 'cyan' }}>{val}</Text>
        ))} */}

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

          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text style={{ color: 'green', margin: 10 }}>Income</Text>
            <Text style={{ color: 'red', margin: 10 }}>Expenses</Text>
            <Text style={{ color: 'cyan', margin: 10 }}>Balance</Text>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

export default Graph;
