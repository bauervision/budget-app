import React, { Component } from 'react';
import { Text, View, Animated, Image, TouchableOpacity } from 'react-native';

import { Svg, LinearGradient } from 'expo';

const { Line, Polyline } = Svg;

import styles from './styles';
import * as Colors from './colors';
import Images from './assets';

class Graph extends Component {
  colorAnim = new Animated.Value(0);
  loadAnim = new Animated.Value(0);

  componentDidMount() {
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
  }

  goBack = () => {
    Animated.timing(this.loadAnim, {
      toValue: 0,
      duration: 500
    }).start(() => this.props.toggle());
  };

  render() {
    const max = 300;
    const min = 0;
    const months = 4;
    let maxtest = 300;
    let mintest = -300;

    const interval = max / months;

    const monthsLine = range =>
      Array.from({ length: range }, (v, i) => i * interval);

    const xline = monthsLine(months);

    const ylineIncome = [1200, 1345, 1300, 1400];
    const ylineExpenses = [1100, 1300, 1400, 1200];
    const ylineBalance = [100, 45, 10, 200];

    const findMax = array => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] > maxtest) {
          maxtest = array[i];
        }
      }
    };

    const findMin = array => {
      for (let i = 0; i < array.length; i++) {
        if (array[i] < mintest) {
          mintest = array[i];
        }
      }
    };

    const findNorm = (array, isIncome) => {
      //multiply by 150 for income only because income will never be less than 0
      // this will keep the range in the positive on the graph
      if (isIncome) {
        for (i = 0; i < array.length; i++) {
          //var norm = ( (array[i] - mintest) /(maxtest - mintest)) * 150;
          var norm = ((maxtest - mintest) / (array[i] - mintest)) * 150 - 150;
          array[i] = norm | 0;
        }
      } else {
        for (i = 0; i < array.length; i++) {
          var norm = (maxtest - mintest) / (array[i] - mintest) + 150;
          array[i] = norm | 0;
        }
      }
    };

    const scaleValue = value => {
      var xMax = 240;
      var xMin = 60;
      var yMax = 300;
      var yMin = 0;

      var percent = (value - yMin) / (yMax - yMin);
      var outputX = percent * (xMax - xMin) + xMin;
      return outputX | 0;
    };

    const scaleArray = array => {
      for (i = 0; i < array.length; i++) {
        array[i] = scaleValue(array[i]);
      }
    };

    const invertValue = value => {
      return (value * -1 + 300) | 0;
    };

    const invertArrayValue = array => {
      for (i = 0; i < array.length; i++) {
        array[i] = invertValue(array[i]);
      }
    };

    //now find the values in the data
    findMax(ylineIncome);
    findMin(ylineIncome);
    findNorm(ylineIncome, true);
    scaleArray(ylineIncome);

    findMax(ylineExpenses);
    findMin(ylineExpenses);
    findNorm(ylineExpenses, true);
    scaleArray(ylineExpenses);

    findMax(ylineBalance);
    findMin(ylineBalance);
    findNorm(ylineBalance, false);
    scaleArray(ylineBalance);
    invertArrayValue(ylineBalance);

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
                outputRange: ['35deg', '0deg']
              })
            }
          ]
        }
      ];
    }

    return (
      <Animated.View style={[pageLoad, { flex: 1 }]}>
        <TouchableOpacity onPress={this.goBack}>
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
            <View>
              <TouchableOpacity onPress={this.goBack}>
                <Animated.Image source={Images.BackBtn} />
              </TouchableOpacity>
            </View>

            <View style={{ justifyContent: 'center' }}>
              <Text
                style={{
                  color: 'cyan',
                  fontSize: 18,
                  borderBottomColor: 'cyan',
                  borderBottomWidth: 1
                }}
              >
                Budget trend
              </Text>
            </View>

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

            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <Text style={{ color: 'green', margin: 10 }}>Income</Text>
              <Text style={{ color: 'red', margin: 10 }}>Expenses</Text>
              <Text style={{ color: 'cyan', margin: 10 }}>Balance</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}

export default Graph;
