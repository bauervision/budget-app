
import React from 'react';
import {View, Alert} from 'react-native';

const Prompt = (props) => {
    return (
       
Alert.alert(
            'Alert Title',
            'My Alert Msg',
            [
              {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
              {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
              },
              {text: 'OK', onPress: () => console.log('OK Pressed')},
            ],
            {cancelable: false},
          );
        
        
    );
};

export default Prompt;

