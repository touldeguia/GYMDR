
import Expo from 'expo'
import firebase from 'firebase'
import React, {Component} from 'react'
import {View, StyleSheet, ActivityIndicator} from 'react-native'
import { NavigationActions } from 'react-navigation'
import FacebookButton from '../components/facebookButton'

import moment from 'moment'
import GeoFire from 'geofire'
export default class Login extends Component {

//------------making the spinner true or buffer animation--------------
  state = {
    showSpinner: true,
  }

//----------starting the life cycle or app-------------------------
  componentDidMount() {
  // firebase.auth().signOut()
    firebase.auth().onAuthStateChanged(auth => {
      if (auth) {
        this.firebaseRef = firebase.database().ref('users')
        this.firebaseRef.child(auth.uid).on('value', snap => {
          const user = snap.val()
          if (user != null) {
            this.firebaseRef.child(auth.uid).off('value')
            this.goHome(user)
          }
        })
      } else {
        this.setState({showSpinner:false})
      }
    })
  }
//----------- function to be called if everything goes well-------------
  goHome(user) {
    const resetAction = NavigationActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({ routeName: 'Home', params:{user}}),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

//--------------check that it's real---------------
  authenticate = (token) => {
    const provider = firebase.auth.FacebookAuthProvider
    const credential = provider.credential(token)
    return firebase.auth().signInWithCredential(credential)
  }

//------making a new user---------------------------
  createUser = (uid, userData) => {

    const defaults = { // This is an object in JSX default for new USERS 
        uid, 
        distance: 5,
        ageRange: [18, 24],
    }

    firebase.database().ref('users').child(uid).update({...userData, ...defaults})
  }

//--------------------------creating the user first chexc in -----------

createUserFirstCheckIn = async (uid) => { 
// initial day 
const checkInDay = moment().format('MM/DD/YYYY')
// initial day plus 2 
const checkInDayPlusTwo = new moment().add(2, 'days').format('MM/DD/YYYY')
// child node made 
const checkin1 = firebase.database().ref('users').child(uid).child('checkInDay1')
  checkin1.set(checkInDayPlusTwo)
// streak child node 
const streak = firebase.database().ref('users').child(uid).child('streakCount')
    streak.set(0)
// get user location 
const checkInTimeNode = firebase.database().ref('users').child(uid).child('checkInTimeBoundary')
                  const checkInTime = + new Date()
                  const checkInTimeSecs =  Math.floor(Date.now() / 10000)
                  const checkInTimeBoundary = checkInTimeSecs + 1440
                  checkInTimeNode.set(checkInTimeBoundary)
                  console.log('CheckInTimeBoundary: ', checkInTimeBoundary)
                  


const {Permissions, Location} = Expo
const {status} = await Permissions.askAsync(Permissions.LOCATION)
      if (status === 'granted') {
           const location = 'location'
           const gymLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
           const {latitude, longitude} = gymLocation.coords
           const geoFireRef = new GeoFire(firebase.database().ref('users').child(uid).child('gym'))
                geoFireRef.set(location, [latitude,longitude])
           
           console.log('Permission Granted', gymLocation)
        } else {
           console.log('Permission Denied')
    }

}



//-------logging the user into the app---------------
  login = async () => {
    this.setState({showSpinner:true})
    const APP_ID = '303201703468939'
    const options = {
      permissions: ['public_profile', 'user_birthday', 'user_work_history', 'email'],
    }
    const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options)
    if (type === 'success') {
      const fields = ['id', 'first_name', 'last_name', 'gender', 'birthday', 'work']
      const response = await fetch(`https://graph.facebook.com/me?fields=${fields.toString()}&access_token=${token}`)
      const userData = await response.json()
      const {uid} = await this.authenticate(token)
      this.createUser(uid, userData)
      this.createUserFirstCheckIn(uid)
    }
  }

//--------------starting the login------------
  render() {
    return (
      <View style={styles.container}>
        {this.state.showSpinner ?
          <ActivityIndicator animating={this.state.showSpinner} /> :
          <FacebookButton onPress={this.login} />
        }
      </View>
    )
  }
}

//---------------------StyleSheet--------
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',

  },
})