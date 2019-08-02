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
  Picker
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import ColorSlider from "./general/ColorSlider";
import Images from "../assets";

class ColorModal extends Component {
  state = {
    visible: false,
    newColor: {}
  };

  // first off store what comes in from props into state so we can edit it
  componentDidupdate = (prevProps) => {
    const { editColor, visible } = this.props;
    if (prevProps.editColor !== editColor) {
      this.setState({
        visible,
        newColor: {
          r: editColor.values.r,
          g: editColor.values.g,
          b: editColor.values.b
        }
      });
    }
  };

  // now handle each slider's update to the new color
  handleR = (value) => {
    // be sure to update state with current state, while adding newest change
    this.setState({ newColor: { ...this.state.newColor, r: value } });
  };

  handleG = (value) => {
    this.setState({ newColor: { ...this.state.newColor, g: value } });
  };
  handleB = (value) => {
    this.setState({ newColor: { ...this.state.newColor, b: value } });
  };

  // send our current color up to our parent and close the modal
  saveColor = () => {
    const { newColor } = this.state;
    const { updateColor, handleToggle } = this.props;

    updateColor(newColor);
    handleToggle();
  };

  // when cancelling, simply reset the edited color, and close the modal
  cancel = () => {
    // set color back to what comes in from props
    const { editColor, handleToggle } = this.props;
    this.setState({
      newColor: {
        r: editColor.values.r,
        g: editColor.values.g,
        b: editColor.values.b
      }
    });
    handleToggle();
  };

  componentToHex = (c) => {
    let hex = Number(c).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };

  rgbToHex = (color) => {
    return (
      "#" +
      this.componentToHex(color.r) +
      this.componentToHex(color.g) +
      this.componentToHex(color.b)
    );
  };

  render() {
    const { newColor } = this.state;
    const { editColor, visible, toggle, customColors } = this.props;

    const updatedColor = this.rgbToHex(newColor);

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
                    color: customColors.FONTLIGHT.color,
                    marginBottom: 20
                  }}
                >
                  Edit your Color
                </Text>

                {/* Color comparison */}
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <View
                    style={{
                      width: 60,
                      height: 120,
                      backgroundColor: `rgb(${editColor.r},${editColor.g},${
                        editColor.b
                      })`
                    }}
                  />

                  <View
                    style={{
                      width: 60,
                      height: 120,
                      backgroundColor: `rgb(${updatedColor.r},${
                        updatedColor.g
                      },${updatedColor.b})`
                    }}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <ColorSlider
                    color="red"
                    value={newColor.r}
                    // classToUse="inputR"
                    onChange={this.handleR}
                  />
                  <ColorSlider
                    color="green"
                    value={newColor.g}
                    // classToUse="inputR"
                    onChange={this.handleG}
                  />
                  <ColorSlider
                    color="blue"
                    value={newColor.b}
                    // classToUse="inputR"
                    onChange={this.handleB}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 17,
                    color: customColors.FONTLIGHT.color,
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
                    justifyContent: "space-between"
                  }}
                >
                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.saveColor();
                      }}
                    >
                      <Animated.Image source={Images.Check} />
                    </TouchableOpacity>
                  </View>

                  <View>
                    <TouchableOpacity
                      onPress={() => {
                        this.cancel();
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
