import React, { Component } from 'react';
import {
  Animated,
  Modal,
  Text,
  TextInput,
  Button,
  View,
  Picker,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView
} from 'react-native';

import styles from '../styles';
import * as Colors from '../colors';

import { LinearGradient } from 'expo';
import { ImageBtn } from '../components/general/basicBtn';

import CategoryBtn from '../components/general/categoryBtn';
import Images from '../assets';

const screenHeight = Dimensions.get('window').height;

class NameModal extends Component {
  state = {
    name_temp: '',
    name: '',
    budget: 0,
    budgets: ['Bud1', 'Bud2', 'Bud3', 'Bud4']
  };

  loadAnim = new Animated.Value(0);

  setModalVisible(visible) {
    this.props.toggle();
  }

  handleNewName = val => {
    this.setState({ name_temp: val, name: '' });
  };

  setNewName = () => {
    if (this.state.name_temp === '') {
      alert('Please enter a name');
    } else {
      this.setState(
        {
          name: this.state.name_temp,
          name_temp: ''
        },
        () => {
          this.props.setVal(this.state.name);
          this.setModalVisible(!this.props.visible);
        }
      );
    }
  };

  // grab categories to display for this budget mode
  updateBudgetSelection = budget => this.setState({ budget });

  render() {
    const { name, name_temp, budget, budgets } = this.state;
    const { budgetName } = this.props;

    const mapBudgets = [];
    this.props.allBudgets.length &&
      this.props.allBudgets.forEach(element => {
        mapBudgets.push(element.name);
      });

    this.props.allBudgets.length && console.log('MapBudgets! ', mapBudgets);

    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.props.visible}
          onRequestClose={() => {
            this.setModalVisible(!this.props.visible);
          }}
        >
          <KeyboardAvoidingView behavior="position">
            <ScrollView>
              <View
                style={{
                  height: screenHeight,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <LinearGradient
                  colors={[
                    'rgb(0,0,0)',
                    'rgb(30,30,30)',
                    'rgb(50,50,50)',
                    'rgb(60,60,70)',
                    'rgb(70,70,80)',
                    'rgb(80,80,90)',
                    'rgb(90,90,100)',
                    '#848e9e'
                  ]}
                >
                  <View
                    style={{
                      padding: 100,
                      borderWidth: 1,
                      borderColor: 'green'
                    }}
                  >
                    {/* Budget Options */}
                    <View
                      style={{
                        flex: 1,
                        flexGrow: 1,
                        borderWidth: 1,
                        borderColor: 'green',
                        padding: 20,
                        margin: 20,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 27,
                          color: '#fff'
                        }}
                      >
                        Budget Options
                      </Text>
                      <View>
                        <Text
                          style={{
                            fontSize: 17,
                            color: 'grey'
                          }}
                        >
                          Current budget name: {budgetName}
                        </Text>

                        <TextInput
                          value={name_temp.toString()}
                          placeholder="Enter a new name... "
                          onChangeText={this.handleNewName}
                          style={styles.inputBudget}
                          placeholderTextColor="black"
                        />

                        <View style={{ height: 50 }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center',
                              height: 70
                            }}
                          >
                            <Button
                              title="Accept Change"
                              onPress={() => {
                                this.setNewName();
                              }}
                            />

                            <Button
                              title="Cancel"
                              onPress={() => {
                                this.setModalVisible(!this.props.visible);
                              }}
                            />
                          </View>
                        </View>
                      </View>

                      {/* Select other budgets */}
                      <View
                        style={{
                          flex: 2,
                          flexGrow: 1,
                          borderWidth: 1,
                          borderColor: 'green',
                          padding: 20,
                          margin: 20,
                          justifyContent: 'center',
                          alignItems: 'center'
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
                          flex: 1,
                          flexGrow: 1,
                          borderWidth: 1,
                          borderColor: 'green',
                          padding: 20,
                          margin: 20,
                          justifyContent: 'center',
                          alignItems: 'center'
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
                              flexDirection: 'row',
                              justifyContent: 'space-evenly',
                              alignItems: 'center'
                            }}
                          >
                            <TextInput
                              placeholder="Enter new..."
                              placeholderTextColor={Colors.darkGreen}
                              onChangeText={data =>
                                this.setState({ textInput: data })
                              }
                              style={{
                                color: Colors.lightGreen,
                                textAlign: 'center',
                                height: 40,
                                width: '60%',
                                borderWidth: 1,
                                borderColor: '#4CAF50',
                                borderRadius: 7,
                                padding: 10
                              }}
                              underlineColorAndroid="transparent"
                            />
                            <ImageBtn
                              onPress={this.joinData}
                              image={Images.Plus}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    );
  }
}

export default NameModal;
