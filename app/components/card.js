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
  PixelRatio,
} from 'react-native'

import moment from 'moment' // for calculating the age of the user 
import clamp from 'clamp'

const CARD_MARGIN = 10
const CARD_HEIGHT = height*.7
const CARD_WIDTH = width - (CARD_MARGIN*2)
const SWIPE_THRESHOLD = 120;
const OFFSCREEN_DX = width*1.2
const ratio = PixelRatio.get()

//---------------------global const and variables section-----
 
 const {width, height} = Dimensions.get('window') // make sure it fits the device

//---------------------------main section--------------
export default class Card extends Component { 
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
      onPanResponderRelease: (e, {dx, vx}) => {
        const absDx = Math.abs(dx) // get the abs. value of the variable x bound to dx
        const direction = absDx / dx // get the direction: neg => left, pos => right
        const swipedRight = direction > 0 // positive x-direction 
        

        if (absDx > 120) { // user moved the card off the screen to the right 
         
          Animated.decay(this.pan, { // then decay it..
            velocity: {x:3 * direction, y:0},
            deceleration: 0.995, 
        }).start(() => this.props.onSwipeOff(swipedRight, this.props.profile.uid)) // calls by reference the function onSwipeOff to reload a new card
      
      } else { 
          Animated.spring(this.pan, { // brings card back to the center 
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
       <View style={styles.imageContainer}>
          <Image
            style={{flex:1}}
            source={{uri: fbImage}}
          />
    <Animated.View style={[styles.likeContainer, { // if the user dislikes the profile 
            transform: [
              {rotate: '30deg'},
            ],
            opacity: this.pan.x.interpolate({
         
               inputRange: [-(SWIPE_THRESHOLD), 0],
              outputRange: [1, 0],
              extrapolate: 'clamp'
            })
          }]}>
            <Image
              style= {styles.like}
              source={require('../images/goodbye.png')}
            />
          </Animated.View>       
    <Animated.View style={[styles.nopeContainer, { // if user likes the profile ; yes the order is switched for the moment and yes it is confusing but it works....
            transform: [
              {rotate: '-30deg'},
            ],
            opacity: this.pan.x.interpolate({
              inputRange: [0, SWIPE_THRESHOLD],
              outputRange: [0, 1],
              extrapolate: 'clamp'
            })
          }]}>
            <Image
              style= {styles.nope}
              source={require('../images/bicep.png')}
            />
          </Animated.View>
        </View>
        <View style={styles.details}>
          <Text style ={styles.name}>{first_name}, {profileAge}</Text>
          <Text style ={styles.work}>{bio}</Text>
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
  backgroundColor:'white', // gymdr difference
  margin: 10, 
 // borderWidth: 1,
//  borderColor: 'white',
  borderRadius: 8, // rounds the card 
},
  container: { 
    flex:1,
    paddingTop: 150
  },
  imageContainer: {
    flex:1,
    overflow: 'hidden',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  cardImage: {
    flex:1,
    width:CARD_WIDTH,
    alignSelf: 'center',
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8
  },
  likeContainer: {
    position: 'absolute',
    top: 1,
    right: CARD_MARGIN,
  },
  nopeContainer: {
    position: 'absolute',
    top: 1,
    left: CARD_WIDTH - CARD_MARGIN - 161,
  },
  details: {
    justifyContent:'center',
    margin: 20,
  },
  name: {
    color: 'black',
    fontSize: 20
  },
  work: {
    color: 'darkgrey',
    fontSize: 15
  },
})




