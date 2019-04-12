import React, { Component } from 'react';
import { View, Text, Animated, TouchableOpacity, Alert } from 'react-native';
import * as Colors from '../../colors';

class CategoryBtn extends Component {
  state = {
    index: this.props.index,
    category: this.props.category,
    catType: this.props.catType
  };

  loadAnim = new Animated.Value(0);

  componentDidMount() {
    Animated.spring(this.loadAnim, {
      toValue: 1,
      friction: 3,
      tension: 60
    }).start();
  }

  onRemove = () => {
    Alert.alert(
      `Remove: ${this.state.category}?`,
      'Are you sure? This will also remove all amounts associated with this category as well.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Remove Value'),
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            //check if this is an expense or income category
            if (this.state.catType === 1) {
              this.props.onRemoveExp(this.state.index);
            } else {
              this.props.onRemoveInc(this.state.index);
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  render() {
    const { category } = this.props;

    const animStyle = [
      { opacity: this.loadAnim },
      {
        translateY: this.loadAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-50, 0]
        })
      }
    ];

    return (
      <TouchableOpacity onPress={this.onRemove}>
        <Animated.View style={animStyle}>
          <View
            style={{
              paddingHorizontal: 30,
              paddingVertical: 10,
              marginBottom: 2,
              borderColor: Colors.lightGreen,
              borderWidth: 1
            }}
          >
            <Text style={{ color: Colors.lightGreen, fontSize: 17 }}>
              {' '}
              {category}{' '}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

export default CategoryBtn;
