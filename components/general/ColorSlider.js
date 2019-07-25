import React, { Component } from "react";
import { Slider } from "react-native";
import styles from "../../styles";

const ColorSlider = ({ color, value, onChange }) => {
  function handleChange(e) {
    // push slider value up to parent
    onChange(e);
  }

  return (
    <Slider
      minimumValue={0}
      maximumValue={255}
      minimumTrackTintColor={color}
      maximumTractTintColor="#FFBBFF"
      step={1}
      value={value}
      onValueChange={handleChange}
      thumbTintColor={color}
      style={styles.slider}
    />
  );
};

export default ColorSlider;
