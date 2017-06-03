import {StackNavigator} from 'react-navigation'
import * as firebase from 'firebase'

import Home from './screens/home'
import Login from './screens/login'
import Chat from './screens/chat'


//-----------------------------adding firebase database---------------------------------------------
const firebaseConfig = {
    apiKey: "AIzaSyCokMTVX6YmsNCDgQ5Jx8GaxG7iEg3nEII",
    databaseURL: "https://gymdr-e46a7.firebaseio.com",
} 

firebase.initializeApp(firebaseConfig)

 const RouteConfigs = {
  Login: {screen:Login},
  Home: {screen:Home},
  Chat: {screen:Chat},

}


const StackNavigatorConfig = {

  headerMode:'none',
  
}



export default StackNavigator(RouteConfigs, StackNavigatorConfig)
    
