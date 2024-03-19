import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
// import App from '../App'
import SessionCodeScreen from '../Screens/SessionCodeScreen'
import TimerSetupScreen from '../Screens/TimerSetupScreen'
import CountdownScreen from '../Screens/CountdownScreen'

const StackNavigations = () => {
    const Stack = createStackNavigator()
  return (
      <Stack.Navigator>
        {/* <Stack.Screen name='Main' component={App}/> */}
        <Stack.Screen name='SessionCode' component={SessionCodeScreen}/>
        <Stack.Screen name='TimerSetupScreen' component={TimerSetupScreen}/>
        <Stack.Screen name='CountdownScreen' component={CountdownScreen}/>
      </Stack.Navigator>
  )
}

export default StackNavigations