import React, {Component} from 'react'
import {
  StyleSheet,
  View, 
  Image, 
  Text,
  PanResponder, 
  Animated,
  Dimensions,
  Easing,
} from 'react-native'

import moment from 'moment' // for calculating the age of the user 

//---------------------global const and variables section-----
 
 const {width, height} = Dimensions.get('window') // make sure it fits the device

//---------------------------main section--------------
export default class Card extends Component { 


// constructor() {
//   super()
//   this.animatedValue1 = new Animated.Value(0)
//   this.animatedValue2 = new Animated.Value(0)
//   this.animatedValue3 = new Animated.Value(0)
// }



// componentDidMount() {
//   this.animate()
// }



// animate () { 
//  this.animatedValue1.setValue(0)
//  this.animatedValue2.setValue(0)
//  this.animatedValue3.setValue(0)

//  const createAnimation = functio(value, duration, easing, delay=0)

//  {
//    return Animated.timing(
//      value,
//      {
//        toValue:1, 
//        duration, 
//        easing, 
//        delay
//      }
//    )
//  }
// Animated.parallel([
//   createAnimation(this.animatedValue1, 2000, Easing.ease),
//   createAnimation(this.animatedValue2, 1000, Easing.ease, 1000),
//   createAnimation(this.animatedValue3, 1000, Easing.ease, 2000)
// ]).start(
// }




//-------------once this component is touched---------- 
  componentWillMount() { 
    this.pan = new Animated.ValueXY()  // this component is Animated
    this.cardPanResponder = PanResponder.create({ // This component has an event
      onStartShouldSetPanResponder: () => true, 
      onPanResponderTerminationRequest: () => false, 
      onPanResponderMove: Animated.event([
        null, 
        {dx:this.pan.x,dy:this.pan.y},
      ]),
//---------once this component is released------------- 
      onPanResponderRelease: (e, {dx}) => {
        const absDx = Math.abs(dx) // get the abs. value of the variable x bound to dx
        const direction = absDx / dx // get the direction: neg => left, pos => right
        const swipedRight = direction > 0 // positive x-direction 
        if (absDx > 120) { // if this component moves further than 120
          Animated.decay(this.pan, { // then decay it..
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995, 
        }).start(() => this.props.onSwipeOff(swipedRight, this.props.profile.uid)) // calls by reference the function onSwipeOff to reload a new card
        } else { 
          Animated.spring(this.pan, { 
          toValue: {x:0, y:0},
          friction: 4.5,
        }).start() 
        }
      },
    })
  }
//----------------card properties----------------------
render() {
    const {birthday, first_name, work, id} = this.props.profile
    const bio = (work && work[0] && work[0].position) ? work[0].position.name : null // to check if there is work if not then put null value
    const profileBday = moment(birthday, 'MM/DD/YYYY')
    const profileAge = moment().diff(profileBday, 'years')
    const fbImage = `https://graph.facebook.com/${id}/picture?height=500`

    const rotateCard = this.pan.x.interpolate({
      inputRange: [-200, 0, 200],
      outputRange: ['10deg', '0deg', '-10deg'],
    })
    // orientatitng the animation 
    // const opacity = this.animatedValue.interpolate({
    //   inputRange: [0, 0.5, 1],
    //   outputRange: [0, 1, 0]
    // })

    // const scaleText = this.animatedValue1.interpolate({
    //   inputRange: [0,1],
    //   outputRange: [0.5, 2]
    // })

    // const spinText = this.animatedValue2.interpolate({
    //   inputRange: [0,1],
    //   outputRange: ['0deg', ]
    // })

   
  

   
//------------------add image && animate the card---------------
 const animatedStyle = { 
   transform: [ 
     {translateX: this.pan.x},
     {translateY: this.pan.y},
     {rotate: rotateCard},
   ]
 }
  return(
 
    <Animated.View
      {...this.cardPanResponder.panHandlers} // accessing the card 
      style={[styles.card, animatedStyle]}> 
      <Image 
        style={{flex:1}}
        source={{uri: fbImage}} // user image 
      /> 
      <View style={{margin:20}}>
        <Text style={{fontSize:20, color:'white'}}>{first_name}, {profileAge}</Text>  
        <Text style={{fontSize:12, color:'black'}}>{bio}</Text> 
      </View>
    </Animated.View> 

    ) // {name}, {profileAge} properties of the card being accessed.
  }
}

//---------------------Card Styles Sheet-------------------
const styles = StyleSheet.create({
card: { 
  position: 'absolute',
  height: height * 0.7,
  width: width - 20,
  top: (height * 0.3)/2, // photo size 
  overflow: 'hidden', // imported image will not exceed the boundaries of the card
  backgroundColor:'red', // gymdr difference
  margin: 10, 
 // borderWidth: 1,
//  borderColor: 'white',
  borderRadius: 8, // rounds the card 
},
  container: { 
    flex:1,
    paddingTop: 150
  }
})




