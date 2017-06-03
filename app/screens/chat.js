console.ignoredYellowBox = ['Warning: Failed prop type: Invalid prop `keyboardShouldPersistTaps`']

import React, {Component} from 'react'
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
} from 'react-native'


import {FontAwesome} from '@expo/vector-icons'
import * as firebase from 'firebase'

import {GiftedChat} from 'react-native-gifted-chat'

export default class Chat extends Component {

  state={
    messages:[],
    user: this.props.navigation.state.params.user,
    profile: this.props.navigation.state.params.profile,
  }

  componentWillMount() {
    const {user, profile} = this.state
    this.chatID = user.uid > profile.uid ? user.uid + '-' + profile.uid : profile.uid + '-' + user.uid
    this.watchChat()
  }

  watchChat = () => {
    firebase.database().ref('messages').child(this.chatID).on('value', snap => {
      let messages = []
      snap.forEach(message => {
        messages.push(message.val())
      })
      messages.reverse()
      this.setState({messages})
    })
  }

  onSend = (message) => {
    firebase.database().ref('messages').child(this.chatID)
      .push({
        ...message[0],
        createdAt: new Date().getTime(),
      })
  }

/* <GiftedChat
        messages={this.state.messages}
        user={{_id: this.state.user.uid, avatar}}
        onSend={this.onSend}
        bottomOffset={100}
      />
      */

  render() {
    const avatar = `https://graph.facebook.com/${this.state.user.id}/picture?height=80`
    const {goBack} = this.props.navigation
    return (

//----------------------------button and the chat screen itself------------------------------------------------------------
      <View style={{flex: 1}}>
        <View style={{flex: 10}}/>
        <View style={{flex: 2000}}> 
          <GiftedChat
            messages={this.state.messages}
            onSend={this.onSend}
            loadEarlier={this.state.loadEarlier}
            user={{ _id: this.state.user.uid, avatar
            }}
          />
        </View>
        <View style={{flex: 7}}/> 
       <TouchableHighlight 
            style={styles.button}
                onPress={() => goBack()}>
          <View style={styles.buttonContainer}>
            <FontAwesome name={'arrow-left'} size={20} color={'white'} />
          </View>
        </TouchableHighlight>
      
      </View>
    )
  }
}

const styles = StyleSheet.create({
    button: { 
        height: 50,
        width: 50, 
        marginTop: 10,
        marginLeft: 10,
        marginBottom:10,
        justifyContent: 'center',

        borderRadius: 100,
    },
    buttonContainer: { 
        flex:1, 
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
    },

})