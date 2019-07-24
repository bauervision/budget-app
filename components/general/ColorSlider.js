import React, { Component } from "react";
import { Slider } from "react-native";

class ColorSlider extends Component {
  state = {
    currentColorValue: 0
  };

  render() {
    return (
      <Slider
        minimumValue={0}
        maximumValue={255}
        minimumTrackTintColor="#1EB1FC"
        maximumTractTintColor="#1EB1FC"
        step={1}
        value={editColor.r}
        onValueChange={(v) => this.setColor()}
        thumbTintColor="#ff0000"
        style={styles.slider}
      />
    );
  }
}

export default ColorSlider;
