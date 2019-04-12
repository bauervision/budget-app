import React, { Component } from 'react';
import { View, Text, Animated, TouchableOpacity, Alert } from 'react-native';

import categories from '../../categories';

const ANIMATION_DURATION = 1000;
const ROW_HEIGHT = 70;

class TouchableBtn extends Component {
  state = {
    value: 0,
    category: ''
  };
  loadAnim = new Animated.Value(0);

  componentDidMount() {
    this.setState({
      value: this.props.item.amount,
      category: this.props.item.category,
      index: this.props.index
    });

    Animated.spring(this.loadAnim, {
      toValue: 1,
      friction: 3,
      tension: 20
    }).start();
  }

  onRemove = () => {
    Alert.alert(
      `Remove: ${this.state.value} (${this.state.category})`,
      'Are you sure?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Remove Value'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.onRemove(this.state.index);
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { item, type } = this.props;

    const expenseStyles = [
      { opacity: this.loadAnim },
      {
        transform: [
          //{ scale: this.loadAnim },
          {
            translateX: this.loadAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-50, 0]
            })
          }
        ]
      }
    ];

    const incomeStyles = [
      { opacity: this.loadAnim },
      {
        transform: [
          //{ scale: this.loadAnim },
          {
            translateX: this.loadAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }
        ]
      }
    ];

    return (
      <TouchableOpacity onPress={this.onRemove}>
        <Animated.View style={type === 1 ? expenseStyles : incomeStyles}>
          <View style={type === 1 ? categories.groceries : categories.salary}>
            <Text
              style={
                type === 1 ? categories.expenseText : categories.incomeText
              }
            >
              {item.category}
            </Text>
            <Text
              style={
                type === 1 ? categories.expenseText : categories.incomeText
              }
            >
              {item.amount}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default TouchableBtn;
