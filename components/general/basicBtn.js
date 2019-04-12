import React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styles from '../../styles';

export const BasicBtn = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          flexDirection: 'row',
          marginBottom: 15,
          justifyContent: 'center'
        }}
      >
        <Text style={props.style}>{props.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const ImageBtn = props => {
  return (
    <View>
      <TouchableOpacity
        onPress={props.onPress}
        style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}
      >
        <Image source={props.image} />
      </TouchableOpacity>
    </View>
  );
};
