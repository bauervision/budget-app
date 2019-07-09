import React, { Component } from "react";
import {
  Modal,
  Text,
  TextInput,
  FlatList,
  Button,
  View,
  TouchableOpacity,
  Image,
  Picker
} from "react-native";

import styles from "../styles";
import * as Colors from "../colors";

import { LinearGradient } from "expo-linear-gradient";
import { ImageBtn } from "../components/general/basicBtn";

import CategoryBtn from "../components/general/categoryBtn";
import Images from "../assets";

class OptionsModal extends Component {
  state = {
    textInput: "",
    localExpenseArray: [],
    localIncomeArray: [],
    category: 0,
    categories: ["Select type...", "Expenses", "Incomes"]
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.incomeCats !== this.state.localIncomeArray ||
      prevProps.expenseCats !== this.state.localExpenseArray
    ) {
      this.setState({
        localExpenseArray: this.props.expenseCats,
        localIncomeArray: this.props.incomeCats
      });
    }
  }

  // grab categories to display for this budget mode
  updateCategorySelection = (category) => {
    this.setState({ category: category });
  };

  handleSignOut = () => {
    this.props.toggle();
    this.props.logout();
  };

  joinData = () => {
    let tempArray = [];
    if (this.state.category === 1) {
      tempArray = this.state.localExpenseArray;
      tempArray.push(this.state.textInput);
      this.setState({ localExpenseArray: tempArray, textInput: "" });
    } else if (this.state.category === 2) {
      tempArray = this.state.localIncomeArray;
      tempArray.push(this.state.textInput);
      this.setState({ localIncomeArray: tempArray, textInput: "" });
    }

    this.props.saveAllCategories(
      this.state.localExpenseArray,
      this.state.localIncomeArray
    );
  };

  render() {
    const {
      localExpenseArray,
      localIncomeArray,
      category,
      categories
    } = this.state;

    let data =
      category === 1 ? localExpenseArray : category === 2 && localIncomeArray;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={() => {
          this.props.toggle();
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
              {/* Signout View*/}
              <View style={{ alignSelf: "flex-end" }}>
                <TouchableOpacity
                  onPress={this.handleSignOut}
                  style={{
                    flexDirection: "row",
                    marginBottom: 5,
                    justifyContent: "space-evenly"
                  }}
                >
                  <Text style={styles.text}>Sign Out!</Text>
                  <Image source={Images.Signout} />
                </TouchableOpacity>
              </View>

              {/* Content View */}
              <View
                style={{
                  flex: 3,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 20
                }}
              >
                <Text
                  style={{
                    fontSize: 27,
                    color: Colors.lightGreen,
                    marginBottom: 20
                  }}
                >
                  Set your Categories
                </Text>

                <View style={{ backgroundColor: Colors.lightGreen }}>
                  <Picker
                    selectedValue={category}
                    onValueChange={this.updateCategorySelection}
                    mode="dropdown"
                    style={{ height: 50, width: 300 }}
                  >
                    {categories.map((cat, index) => {
                      return (
                        <Picker.Item key={index} label={cat} value={index} />
                      );
                    })}
                  </Picker>
                </View>

                {category !== 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10
                    }}
                  >
                    <TextInput
                      placeholder="Enter new..."
                      placeholderTextColor={Colors.darkGreen}
                      onChangeText={(data) => this.setState({ textInput: data })}
                      style={{
                        color: Colors.lightGreen,
                        textAlign: "center",
                        height: 40,
                        width: "60%",
                        borderWidth: 1,
                        borderColor: "#4CAF50",
                        borderRadius: 7,
                        padding: 10
                      }}
                      underlineColorAndroid="transparent"
                    />
                    <ImageBtn onPress={this.joinData} image={Images.Plus} />
                  </View>
                )}

                <FlatList
                  data={data}
                  extraData={data}
                  renderItem={({ item, index }) => (
                    <CategoryBtn
                      category={item}
                      onRemoveExp={this.props.removeExp}
                      onRemoveInc={this.props.removeInc}
                      index={index}
                      catType={category}
                    />
                  )}
                  keyExtractor={(item, index) => index.toString()}
                  ref={(ref) => {
                    this.ExpenseFlatlistRef = ref;
                  }}
                  onContentSizeChange={() => {
                    this.ExpenseFlatlistRef.scrollToEnd({ animated: true });
                  }}
                  onLayout={() => {
                    this.ExpenseFlatlistRef.scrollToEnd({ animated: true });
                  }}
                />
              </View>

              {/* Bottom Buttons */}
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end"
                  }}
                >
                  <Button
                    color={Colors.darkGreen}
                    title="Done"
                    onPress={() => {
                      this.props.toggle();
                    }}
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    );
  }
}

export default OptionsModal;
