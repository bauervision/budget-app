import React, { Component } from "react";
import { View, Animated, Image, Easing } from "react-native";
import Images from "../assets";
import { Svg } from "expo";

import * as Colors from "../colors";

class componentName extends Component {
  animatedValue = new Animated.Value(0);

  componentDidMount() {
    this.animate();
  }

  animate() {
    this.animatedValue.setValue(0);
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 700,
      easing: Easing.linear
    }).start(() => this.animate());
  }

  render() {
    const opacity = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: [0, 1, 0]
    });

    const spin = this.animatedValue.interpolate({
      inputRange: [0, 0.2, 1],
      outputRange: ["0deg", "360deg", "360deg"]
    });

    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Animated.Image
          style={{
            width: 170,
            height: 170,
            opacity,
            transform: [{ rotate: spin }]
          }}
          source={Images.Logo}
        />
      </View>
    );
  }
}

export default componentName;
