import React, { Component } from 'react';
import { Animated, Modal, Text, FlatList, Button, View } from 'react-native';

import styles from '../styles';
import * as Colors from '../colors';

import { LinearGradient } from 'expo';

import { BasicBtn } from '../components/general/basicBtn';

class TallyModal extends Component {
  render() {
    const { type, data } = this.props;

    return (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.visible}
          onRequestClose={() => {
            this.props.toggle();
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
                    {type} Tally
                  </Text>

                  <View>
                    <FlatList
                      data={data}
                      renderItem={({ item, index }) => (
                        <Text style={styles.text}>{item}</Text>
                      )}
                      keyExtractor={(item, index) => index.toString()}
                    />

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        height: 70
                      }}
                    >
                      <BasicBtn
                        text="Close"
                        style={{
                          padding: 20,
                          color: 'white',
                          borderRadius: 10,
                          backgroundColor: Colors.darkGreen
                        }}
                        onPress={this.props.toggle}
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

export default TallyModal;
