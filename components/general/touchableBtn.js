import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  TouchableOpacity
} from 'react-native';

import styles from '../../styles';

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 70;

class TouchableBtn extends Component {
  _animated = new Animated.Value(0);

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION
    }).start();
  }

  onRemove = () => {
    const { onRemove } = this.props;
    if (onRemove) {
      Animated.timing(this._animated, {
        toValue: 0,
        duration: ANIMATION_DURATION
      }).start(() => onRemove());
    }
  };

  render() {
    const { id } = this.props;

    const rowStyles = [
      styles.row,
      {
        height: this._animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, ROW_HEIGHT],
          extrapolate: 'clamp'
        })
      },
      { opacity: this._animated },
      {
        transform: [
          {
            translateX: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: [-350, 0] // 0 : 150, 0.5 : 75, 1 : 0
            })
          }
        ]
      }
    ];

    return (
      <TouchableOpacity>
        <Animated.View style={rowStyles}>
          <View style={styles.budgetBox}>
            <Text style={styles.budgetName}>{id}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default TouchableBtn;
