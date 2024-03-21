import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SessionCodeScreen from '../Screens/SessionCodeScreen';
import TimerSetupScreen from '../Screens/TimerSetupScreen';
import CountdownScreen from '../Screens/CountdownScreen';

const StackNavigations = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1c1c1e', 
        },
        headerTintColor: '#fff', 
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        cardStyle: {
          backgroundColor: '#121212', 
        },
      }}
    >
      <Stack.Screen name='SessionCode' component={SessionCodeScreen} options={{ title: 'Session Code' }}/>
      <Stack.Screen name='TimerSetupScreen' component={TimerSetupScreen} options={{ title: 'Timer Setup' }}/>
      <Stack.Screen name='CountdownScreen' component={CountdownScreen} options={{ title: 'Countdown' }}/>
    </Stack.Navigator>
  );
}

export default StackNavigations;
