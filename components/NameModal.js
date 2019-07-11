/* eslint-disable react/prop-types */
import React, { Component } from "react";

import {
  Animated,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  Button,
  View,
  Picker,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Platform
} from "react-native";

import styles from "../styles";
import * as Colors from "../colors";

import { LinearGradient } from "expo-linear-gradient";
import { ImageBtn } from "../components/general/basicBtn";

import Images from "../assets";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

class NameModal extends Component {
  state = {
    name_temp: "",
    name: "",
    budget: 0,
    budgets: [],
    newName: ""
  };

  loadAnim = new Animated.Value(0);

  setModalVisible(visible) {
    this.props.toggle();
  }

  handleNewName = (val) => {
    this.setState({ name_temp: val, name: "" });
  };

  setNewName = () => {
    if (this.state.name_temp === "") {
      alert("Please enter a name");
    } else {
      this.setState(
        {
          name: this.state.name_temp,
          name_temp: ""
        },
        () => {
          this.props.setVal(this.state.name);
          this.setModalVisible(!this.props.visible);
        }
      );
    }
  };

  // grab categories to display for this budget mode
  updateBudgetSelection = (budgetIndex) => {
    this.props.setActive(budgetIndex);
    this.setState({ budget: budgetIndex });
  };

  handleAddNewBudget = () => {
    this.props.addNewBudget(this.state.newName);
  };

  render() {
    const { name_temp, budget } = this.state;
    const { budgetName } = this.props;

    const mapBudgets = [];
    this.props.allBudgets.length &&
      this.props.allBudgets.forEach((element) => {
        mapBudgets.push(element.name);
      });

    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.props.visible}
          onRequestClose={() => {
            this.setModalVisible(!this.props.visible);
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
          >
            <ScrollView contentContainerStyle={{ paddingVertical: 50 }}>
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
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  height: screenHeight,
                  paddingBottom: 50
                }}
              />
              <View style={{ flex: 1 }}>
                {/* Budget Options */}

                <Text
                  style={{
                    fontSize: 27,
                    color: "#fff",
                    textAlign: "center"
                  }}
                >
                  Budget Options
                </Text>

                {/* Current Budget */}
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 30,
                    backgroundColor: "red"
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 17,
                      color: "grey",
                      margin: 5
                    }}
                  >
                    Current budget name:
                  </Text>

                  <View style={{ flexDirection: "row" }}>
                    <TextInput
                      value={name_temp.toString()}
                      placeholder="Enter a New Name..."
                      onChangeText={this.handleNewName}
                      style={styles.inputBudget}
                      placeholderTextColor="black"
                    />
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          this.setNewName();
                        }}
                      >
                        <Animated.Image source={Images.Check} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Select other budgets */}
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 30,
                    backgroundColor: "purple"
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 23,
                        color: Colors.lightGreen
                      }}
                    >
                      Available budgets to load
                    </Text>

                    <View style={{ backgroundColor: Colors.lightGreen }}>
                      <Picker
                        selectedValue={budget}
                        onValueChange={this.updateBudgetSelection}
                        mode="dropdown"
                        style={{ height: 50, width: 300 }}
                      >
                        {mapBudgets.map((cat, index) => {
                          return (
                            <Picker.Item
                              key={index}
                              label={cat}
                              value={index}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* Add new Budget */}
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    marginVertical: 30,
                    backgroundColor: "orange"
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontSize: 23,
                        color: Colors.lightGreen,
                        marginBottom: 20
                      }}
                    >
                      Add a new Budget
                    </Text>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center"
                      }}
                    >
                      <TextInput
                        placeholder="Enter new..."
                        placeholderTextColor={Colors.darkGreen}
                        onChangeText={(data) => this.setState({ newName: data })}
                        style={{
                          color: Colors.lightGreen,
                          textAlign: "center",
                          height: 40,
                          width: "75%",
                          borderWidth: 1,
                          borderColor: "#4CAF50",
                          borderRadius: 7,
                          padding: 10
                        }}
                        underlineColorAndroid="transparent"
                      />
                      <ImageBtn
                        onPress={this.handleAddNewBudget}
                        image={Images.Plus}
                      />
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    marginVertical: 30,
                    backgroundColor: "green"
                  }}
                >
                  <View
                    style={{
                      margin: 10
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setModalVisible(!this.props.visible);
                      }}
                    >
                      <Animated.Image source={Images.Close} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

export default NameModal;
