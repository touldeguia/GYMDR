import Expo from 'expo'
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableHighlight,
} from 'react-native'

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

  
// CheckIn = async () => {
   
//       this.createCheckIn(uid)
//     }
  
//   }
    

    
    checkIn = async () => {
  
      const {Permissions, Location} = Expo
      const {status} = await Permissions.askAsync(Permissions.LOCATION)
      if (status === 'granted') {
           const location = await Location.getCurrentPositionAsync({enableHighAccuracy: false})
           const {latitude, longitude} = location.coords
           const geoFireRef = new GeoFire(firebase.database().ref('geoData'))
           geoFireRef.set(this.props.user.uid, [latitude, longitude])
           console.log('Permission Granted', location)
        } else {
          console.log('Permission Denied')
    }
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
    backgroundColor:'#90EE90',
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