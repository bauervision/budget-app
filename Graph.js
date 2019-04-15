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

import { Svg } from 'expo';
const { Defs, LinearGradient, Stop, Line } = Svg;
import { LineChart, Grid } from 'react-native-svg-charts';

import styles from './styles';
import * as Colors from './colors';
import Images from './assets';

const budgets = [
  { balance: 100 },
  { balance: 200 },
  { balance: 300 },
  { balance: 100 },
  { balance: -100 },
  { balance: 0 },
  { balance: 200 },
  { balance: 400 }
];

class Graph extends Component {
  state = {};

  animation = new Animated.Value(0);
  colorAnim = new Animated.Value(0);

  componentDidMount() {
    Animated.spring(this.animation, {
      toValue: 1,
      friction: 3,
      tension: 20
    }).start();

    Animated.loop(
      Animated.timing(this.colorAnim, {
        toValue: 1,
        duration: 2000
      })
    ).start();
  }

  render() {
    const animLogo = [
      { opacity: this.animation },
      {
        transform: [
          {
            translateY: this.animation.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }
        ]
      }
    ];

    let borderTopColor = this.colorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [Colors.lightGreen, Colors.navyBlue, Colors.lightGreen]
    });

    let borderBottomColor = this.colorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [Colors.navyBlue, Colors.lightGreen, Colors.navyBlue]
    });

    const data = [
      50,
      10,
      40,
      95,
      -4,
      -24,
      85,
      91,
      35,
      53,
      -53,
      24,
      50,
      -20,
      -80
    ];

    const Gradient = () => (
      <Defs key={'gradient'}>
        <LinearGradient id={'gradient'} x1={'0'} y={'0%'} x2={'100%'} y2={'0%'}>
          <Stop offset={'0%'} stopColor={'rgb(134, 65, 244)'} />
          <Stop offset={'100%'} stopColor={'rgb(66, 194, 244)'} />
        </LinearGradient>
      </Defs>
    );

    return (
      <View
        style={{
          backgroundColor: 'grey'
        }}
      >
        <LineChart
          style={{ height: 200 }}
          data={data}
          contentInset={{ top: 20, bottom: 20 }}
          svg={{
            strokeWidth: 2,
            stroke: 'url(#gradient)'
          }}
        >
          <Grid />
          <Gradient />
        </LineChart>

        <Svg height="300" width="300">
          <Line x1="0" y1="0" x2="100" y2="100" stroke="red" strokeWidth="2" />
        </Svg>
      </View>
    );
  }
}

export default Graph;
