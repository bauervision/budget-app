import React, { Component } from 'react';
import { Animated, Modal, Text, TextInput, Button, View } from 'react-native';

import styles from '../styles';
import * as Colors from '../colors';

import { LinearGradient } from 'expo';

class NameModal extends Component {
  state = {
    name_temp: '',
    name: ''
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

  render() {
    const { name, name_temp } = this.state;
    const { budgetName } = this.props;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.visible}
          onRequestClose={() => {
            this.setModalVisible(!this.props.visible);
          }}
        >
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
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
                  flex: 1,
                  padding: 30,

                  borderRadius: 30,
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Text
                    style={{
                      fontSize: 30,
                      color: '#fff'
                    }}
                  >
                    Set Budget Name
                  </Text>

                  <Text
                    style={{
                      fontSize: 15,
                      color: 'blue'
                    }}
                  >
                    Current name: {budgetName}
                  </Text>

                  <TextInput
                    value={name_temp.toString()}
                    placeholder="Enter a new name... "
                    onChangeText={this.handleNewName}
                    style={styles.inputBudget}
                    placeholderTextColor={Colors.InputBright}
                  />

                  <View style={styles.header}>
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

                          // also send update to database
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
              </View>
            </LinearGradient>
          </View>
        </Modal>
      </View>
    );
  }
}

export default NameModal;
