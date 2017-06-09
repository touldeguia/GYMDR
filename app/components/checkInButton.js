import React, {Component} from 'react'
import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
} from 'react-native'

import {FontAwesome} from '@expo/vector-icons'

export default class ChekInButton extends Component {
  render() {
    return (
      <TouchableHighlight
        style={styles.button}
        onPress={this.props.onPress}>
        <View style={styles.buttonContainer}>
          <FontAwesome name={'map-marker'} size={35} color={'white'}/>   
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    height:50,
    width:50,
    marginTop: 50,
    backgroundColor:'#008000',
    borderRadius: 100,
    borderColor:'white',
    borderWidth: 2,
  },
  buttonContainer: {
    flex:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  },
  buttonText: {
    color:'white',
    fontSize:20,
  },
})