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

import styles from "../styles";
// import * as Colors from "../colors";

import { LinearGradient } from "expo-linear-gradient";
import { ImageBtn } from "../components/general/basicBtn";

import CategoryBtn from "../components/general/categoryBtn";
import Images from "../assets";
import ColorModal from "./ColorModal";

class OptionsModal extends Component {
  state = {
    textInput: "",
    localExpenseArray: [],
    localIncomeArray: [],
    category: 0,
    categories: ["Select type...", "Expenses", "Incomes"],
    colorVisible: false,
    editColor: ""
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

  handleColorChange = (color) => {
    console.log(color);
    this.setState({ editColor: color }, () => this.toggleColorModal());
  };

  toggleColorModal = () => {
    this.setState((state) => {
      return {
        colorVisible: !state.colorVisible
      };
    });
  };

  updateColor = (color) => {
    const { updateCustomColor } = this.props;
    updateCustomColor(color);
    this.setState(
      {
        editColor: {
          r: color.r,
          g: color.g,
          b: color.b
        }
      },
      () => this.toggleColorModal()
    );
  };

  render() {
    const {
      localExpenseArray,
      localIncomeArray,
      category,
      categories,
      colorVisible,
      editColor
    } = this.state;

    const { customColors } = this.props;

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
                    color: `rgb(${customColors.accents.lightText.r},${
                      customColors.accents.lightText.g
                    },${customColors.accents.lightText.b})`,
                    marginBottom: 20
                  }}
                >
                  Set Your Main Colors
                </Text>
                {/* Main color swatches */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "grey",
                    flexDirection: "row"
                  }}
                >
                  <View style={{ margin: 5 }}>
                    <TouchableOpacity
                      style={{
                        width: 40,
                        height: 40,
                        backgroundColor: `rgb(
                          ${customColors.main.primary.r},
                          ${customColors.main.primary.g},
                          ${customColors.main.primary.b}
                        )`
                      }}
                      onPress={() =>
                        this.handleColorChange(customColors.main.primary)
                      }
                    />
                  </View>

                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(
                        ${customColors.main.secondary.r},
                        ${customColors.main.secondary.g},
                        ${customColors.main.secondary.b}
                      )`
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(
                        ${customColors.main.tertiary.r},
                        ${customColors.main.tertiary.g},
                        ${customColors.main.tertiary.b}
                      )`
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(
                        ${customColors.accents.lightText.r},
                        ${customColors.accents.lightText.g},
                        ${customColors.accents.lightText.b}
                      )`
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(
                        ${customColors.accents.highlight.r},
                        ${customColors.accents.highlight.g},
                        ${customColors.accents.highlight.b}
                      )`
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 24,
                    color: `rgb(${customColors.accents.lightText.r},${
                      customColors.accents.lightText.g
                    },${customColors.accents.lightText.b})`,
                    marginBottom: 20
                  }}
                >
                  Accents
                </Text>

                {/* Accent color swatches */}
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "grey",
                    flexDirection: "row"
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(${
                        customColors.accents.lightText.r
                      },${customColors.accents.lightText.g},${
                        customColors.accents.lightText.b
                      })`
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(${
                        customColors.accents.darkText.r
                      },${customColors.accents.darkText.g},${
                        customColors.accents.darkText.b
                      })`
                    }}
                  />
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(${
                        customColors.accents.highlight.r
                      },${customColors.accents.highlight.g},${
                        customColors.accents.highlight.b
                      })`
                    }}
                  />

                  <View
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: `rgb(${
                        customColors.accents.lowlight.r
                      },${customColors.accents.lowlight.g},${
                        customColors.accents.lowlight.b
                      })`
                    }}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 27,
                    color: `rgb(${customColors.accents.lightText.r},${
                      customColors.accents.lightText.g
                    },${customColors.accents.lightText.b})`,
                    marginBottom: 20
                  }}
                >
                  Set your Categories
                </Text>

                <View
                  style={{ backgroundColor: customColors.accents.lightText }}
                >
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
                      placeholderTextColor={`rgb(${
                        customColors.accents.lightText.r
                      },${customColors.accents.lightText.g},${
                        customColors.accents.lightText.b
                      })`}
                      onChangeText={(data) => this.setState({ textInput: data })}
                      style={{
                        color: customColors.accents.lightText,
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

          <ColorModal
            visible={colorVisible}
            handleToggle={this.toggleColorModal}
            editColor={editColor}
            updateColor={this.updateColor}
            customColors={customColors}
          />
        </View>
      </Modal>
    );
  }
}

export default OptionsModal;
