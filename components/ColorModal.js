import React, { Component } from "react";
import {
  Alert,
  Animated,
  Modal,
  Text,
  TextInput,
  FlatList,
  View,
  TouchableOpacity,
  Image,
  Picker,
  Slider
} from "react-native";

import styles from "../styles";
import * as Colors from "../colors";

import { LinearGradient } from "expo-linear-gradient";
import { ImageBtn } from "../components/general/basicBtn";

import CategoryBtn from "../components/general/categoryBtn";
import Images from "../assets";

class ColorModal extends Component {
  state = {
    color: {
      rValue: 0,
      gValue: 0,
      bValue: 0
    }
  };

  componentDidMount = () => {};

  componentToHex = (c) => {
    let hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  rgbToHex = (color) => {
    return (
      "#" +
      this.componentToHex(color.rValue) +
      this.componentToHex(color.gValue) +
      this.componentToHex(color.bValue)
    );
  };

  setRColor(rValue) {
    this.setState({ color: { rValue } });
  }
  setGColor(gValue) {
    this.setState({ color: { gValue } });
  }
  setBColor(bValue) {
    this.setState({ color: { bValue } });
  }

  render() {
    const { rValue, gValue, bValue, color } = this.state;

    const { editColor, visible, toggle } = this.props;

    const updatedColor = this.rgbToHex(color);

    return (
      <Modal
        animationType="slide"
        //transparent={true}
        visible={visible}
        onRequestClose={() => {
          toggle();
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <LinearGradient
            colors={[
              "rgb(0,0,0)",
              "rgb(30,30,30)",
              "rgb(50,50,50)",
              "rgb(60,60,70)",
              "rgb(70,70,80)",
              "rgb(80,80,90)",
              "rgb(90,90,100)",
              "#848e9e"
            ]}
          >
            {/* Whole Modal View */}
            <View
              style={{
                flex: 1,
                padding: 70,
                justifyContent: "flex-start",
                alignItems: "stretch"
              }}
            >
              {/* Content View */}
              <View
                style={{
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <Text
                  style={{
                    fontSize: 27,
                    color: Colors.lightGreen,
                    marginBottom: 20
                  }}
                >
                  Edit your Color
                </Text>

                <View
                  style={{
                    width: 120,
                    height: 120,
                    backgroundColor: editColor,
                    margin: 20
                  }}
                />

                <View style={{ flex: 1, backgroundColor: "green" }}>
                  <Slider
                    minimumValue={0}
                    maximumValue={255}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTractTintColor="#1EB1FC"
                    step={1}
                    value={rValue}
                    onValueChange={(value) => this.setRColor(value)}
                    thumbTintColor="#ff0000"
                    style={styles.slider}
                  />
                  <Slider
                    minimumValue={0}
                    maximumValue={255}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTractTintColor="#1EB1FC"
                    step={1}
                    value={gValue}
                    onValueChange={(value) => this.setGColor(value)}
                    thumbTintColor="#00ff00"
                    style={styles.slider}
                  />
                  <Slider
                    minimumValue={0}
                    maximumValue={255}
                    minimumTrackTintColor="#1EB1FC"
                    maximumTractTintColor="#1EB1FC"
                    step={1}
                    value={bValue}
                    onValueChange={(value) => this.setBColor(value)}
                    thumbTintColor="#0000ff"
                    style={styles.slider}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 17,
                    color: Colors.lightGreen,
                    margin: 20
                  }}
                >
                  HEX Value: {updatedColor}
                </Text>
              </View>

              {/* Bottom Buttons */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end"
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.props.toggle();
                      }}
                    >
                      <Animated.Image source={Images.Close} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  }
}

export default ColorModal;
