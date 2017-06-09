import Expo from 'expo'
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableHighlight,
  Image,
} from 'react-native'
import moment from 'moment'
import _ from 'lodash'
import { 
  NavigationActions,  
  withNavigation } from 'react-navigation'
import GeoFire from 'geofire'
import Slider from 'react-native-multislider'
import * as firebase from 'firebase'
import Home from '../screens/home'
import CircleImage from '../components/circleImage'
import CheckInButton from '../components/checkInButton'

export default class Profile extends Component {


  updateUser = (key, value) => {
    const {uid} = this.props.user
    firebase.database().ref('users').child(uid)
      .update({[key]:value})
  }



  
checkIn = async () => {
  
  uid = this.props.user.uid // uid key for the object returned
  console.log('uid',uid)

  

            const checkInTimeUpperBoundary = firebase.database().ref().child('checkIn').child(uid).child('checkInTimeBoundary').once('value', (snap) => {
            const checkInTimeBoundary = snap.val()
            //getting the previous checkInDay1
            const  checkInDay1 = firebase.database().ref().child('checkIn').child(uid).child('checkInDay1').once('value', (snap) => {
            const  checkInDayTimeBoundary = snap.val() // local variable 
            //getting the previous streakCount
            const streakCountChild = firebase.database().ref().child('checkIn').child(uid).child('streakCount').once('value', (snap) => { 
            const streakCount = snap.val()
            // getting the previous latitude and longitude
            const coords = firebase.database().ref().child('checkIn').child(uid).child('gym').child('location').once('value', async (snap) => { 
            const prevCoords = snap.val()
           
            const {Permissions, Location} = Expo // change this to update the gym location......? 
            const {status} = await Permissions.askAsync(Permissions.LOCATION)
            if (status === 'granted') {
    

                  const newCheckInTime = moment().unix('X')
                  const newCheckInDay = moment().format('MM/DD/YYYY')
                  const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
                  const {latitude, longitude} = location.coords
                  
                  // rounding the current lat and long in order to compare it.. 
                  const currentLatitude =  Math.round(latitude * 100.0) / 100.0
                  const currentLongitude =  Math.round(longitude * 100.0) / 100.0
                
                  var array =  _.values(prevCoords) // extracting the coords from the object 
                  // extracting the data 
                  array0 = array[0]
                  array1 = array[1]
                  array2 = array1[0] // lat 
                  array3 = array1[1] // long data that I want 

                  
                  
                  var prevLongitude = Math.round(array3 * 100.0) / 100.0
                  var prevLatitude = Math.round(array2 * 100) / 100.0

                    console.log('checkInTimeBoundary: ', checkInDayTimeBoundary)
                    console.log('streakCount: ', streakCount)
                    console.log('array', array)
                    console.log('arr0',array0)
                    console.log('arr1',array1)
                    console.log('arr2',array2)
                    console.log('arr3',array3)
                    console.log('current latitude', currentLatitude)
                    console.log('current longitude', currentLongitude)
                    console.log('prevLongitude',prevLongitude)
                    console.log('prevLatitude', prevLatitude)
                    console.log('checkInDayTimeBoundary: ', checkInDayTimeBoundary)
                    console.log('NewCheckInDay:', newCheckInDay)
                    console.log('NewCheckInTime: ', newCheckInTime)
                    console.log('CheckInTimeBoundary:', checkInTimeBoundary)
                    
  
                    // if these conditions are met then we will increase streak count node and if they aren't met then we will set the new gym location'
                    if( (prevLongitude == currentLongitude ) && (prevLatitude == currentLatitude) && (newCheckInDay <= checkInDayTimeBoundary) && (newCheckInTime >= checkInTimeBoundary)){
                            var newStreakCount = streakCount 
                                newStreakCount = newStreakCount + 1 
                            const updateStreakCount = firebase.database().ref('checkIn').child(uid).child('streakCount')
                                  updateStreakCount.set(newStreakCount)
                            
                            
                            const newCheckInTime = moment().unix('X')
                                  newCheckInTime = newCheckInTime + newCheckInTime
                            const newCheckInTimeBoundary =  firebase.database().ref().child('checkIn').child(uid).child('checkInTimeBoundary')
                                  newCheckInTimeBoundary.set(newCheckInTime)
                          
                            console.log('newCheckInTimeBoundaryIs: ', newCheckInTime)
                            console.log('updatedStreakCount',newStreakCount)
                  
                    } else { 
                          //resetting the streak count on the user's node '
                          var newStreakCount = streakCount 
                          newStreakCount = newStreakCount - newStreakCount 
                          const updateStreakCount = firebase.database().ref('checkIn').child(uid).child('streakCount')
                                      updateStreakCount.set(newStreakCount)
                          
                          //resetting the gym location on the user node             
                          const {Permissions, Location} = Expo
                          const {status} = await Permissions.askAsync(Permissions.LOCATION)
                          if (status === 'granted') {
                              const location = 'location'
                              const gymLocation = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
                              const {latitude, longitude} = gymLocation.coords
                              const geoFireRef = new GeoFire(firebase.database().ref('checkIn').child(uid).child('gym'))
                                    geoFireRef.set(location, [latitude,longitude])
                              
                              console.log('Permission Granted', gymLocation)
                            } else {console.log('Permission Denied')}              
                          console.log('new streak count is:', newStreakCount)
                          console.log('Reset')
                  
                    }
                
            } else {console.log('Permission Denied')}
          
        })
     })
    
   })
  })         
  }

 

state = {
    ageRangeValues: this.props.user.ageRange,
    distanceValue: [this.props.user.distance],
    showWeightLifting: this.props.user.showWeightLifting,
    showCardio: this.props.user.showCardio,
  }



  render() {

    const {first_name, work, id} = this.props.user
    const {ageRangeValues, distanceValue, showMen, showWomen, showWeightLifting, showCardio} = this.state
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null
    return (
      
      <View style={styles.container}>
        <View style={{alignItems:'center'}}>
          <Text style={{fontSize:25, color:'white',marginTop:50}}>GYMDR</Text>
        </View>
        <View style={styles.profile}>
          <CircleImage facebookID={id} size={120} />
          <Text style={{fontSize:20, color:'white'}}>{first_name}</Text>
          <Text style={{fontSize:12, color:'black'}}>{bio}</Text>
      <CheckInButton onPress={this.checkIn}/>
        <Text>Check Into GYM</Text>
      </View>

       
        
        <View style={styles.label}>
          <Text style={{color:'white'}}>Distance</Text>
          <Text style={{color:'black'}}>{distanceValue} mi</Text>
        </View>
         <Slider
          markerStyle={{height:20, width: 20, borderRadius:100,}}
          selectedStyle={{backgroundColor:'#008000'}}
          min={1}
          max={30}
          values={distanceValue}
          onValuesChange={val => this.setState({distanceValue:val})}
          onValuesChangeFinish={val => this.updateUser('distance', val[0])}
        />

        <View style={styles.label}>
          <Text style={{color:'white'}}>Age Range</Text>
          <Text style={{color:'black'}}>{ageRangeValues.join('-')}</Text>
        </View>
        <Slider
          markerStyle={{height:20, width: 20, borderRadius:100,}}
          selectedStyle={{backgroundColor:'#008000'}}
          min={18}
          max={70}
          values={ageRangeValues}
          onValuesChange={val => this.setState({ageRangeValues:val})}
          onValuesChangeFinish={val => this.updateUser('ageRange', val)}
        />

  
        <View style={styles.switch}>
          <Text style={{color:'white'}}>Cardio</Text>
          <Switch
            onTintColor='#008000'
            value={showCardio}
            onValueChange={val => {
              this.setState({showCardio:val})
              this.updateUser('showCardio', val)
            }}
          />

        <View style={styles.switch}>
          <Text style={{color:'white'}}>Weightlifting</Text>
          <Switch
            onTintColor='#008000'
            value={showWeightLifting}
            onValueChange={val => {
              this.setState({showWeightLifting:val})
              this.updateUser('showWeightLifting', val)
            }}
          />
            </View>
          </View>
        </View>  
    )
   }
  }








const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#25D366',
  },
  profile: {
    flex:1,
    alignItems:'center',
    justifyContent:'center',

  },
   label: {
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    marginLeft:20,
    marginRight:20,
  },
  switch: {
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'space-between',
    margin:1,
  },
})