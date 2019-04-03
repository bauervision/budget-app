import React, { Component } from 'react';
import { Modal, Text, TouchableHighlight, View, FlatList } from 'react-native';

export default class BudgetModal extends Component {
  render() {
    const { title, modalVisible, onDismiss, modalAmounts } = this.props;
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            onDismiss(false);
          }}
        >
          <View
            style={{
              flex: 1,
              marginTop: 22,
              justifyContent: 'space-evenly',
              alignItems: 'center',
              backgroundColor: 'rgba(10,10,50,0.2)'
            }}
          >
            <View>
              <Text>{title}</Text>
              <FlatList
                data={modalAmounts}
                renderItem={({ item, index }) => (
                  <View style={categories.salary}>
                    <Text style={categories.incomeText}>{item}</Text>
                  </View>
                )}
                keyExtractor={(item, index) => index.toString()}
              />

              <TouchableHighlight
                onPress={() => {
                  onDismiss(false);
                }}
              >
                <Text>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

// class BudgetModal extends Component {
//   state = {
//     modalVisible: this.props.modalVisible
//   };

//   _setModalVisible(visible) {
//     this.setState({ modalVisible: visible });
//   }

//   render() {
//     const { title, modalVisible, modalAmounts, setModalVisible } = this.props;

//     return (
//       <View>
//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={modalVisible}
//           onRequestClose={() => {
//             this._setModalVisible(false);
//           }}
//         >
//           <View
//             style={{
//               flex: 1,
//               marginTop: 22,
//               justifyContent: 'space-evenly',
//               alignItems: 'center',
//               backgroundColor: 'rgba(10,10,50,0.2)'
//             }}
//           >
//             <View>
//               <Text>{title}</Text>
//               <FlatList
//                 data={modalAmounts}
//                 renderItem={({ item, index }) => (
//                   <View style={categories.salary}>
//                     <Text style={categories.incomeText}>{item}</Text>
//                   </View>
//                 )}
//                 keyExtractor={(item, index) => index.toString()}
//               />

//               <TouchableHighlight
//                 onPress={() => {
//                   this._setModalVisible(false);
//                 }}
//               >
//                 <Text>Hide Modal</Text>
//               </TouchableHighlight>
//             </View>
//           </View>
//         </Modal>
//       </View>
//     );
//   }
// }

// export default BudgetModal;
