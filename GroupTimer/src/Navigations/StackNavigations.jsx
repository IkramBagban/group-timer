import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SessionCodeScreen from '../Screens/SessionCodeScreen';
import TimerSetupScreen from '../Screens/TimerSetupScreen';
import SessionScreen from '../Screens/SessionScreen';

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
      <Stack.Screen name='SessionCode' component={SessionCodeScreen} options={{ headerShown:false }}/>
      <Stack.Screen name='TimerSetupScreen' component={TimerSetupScreen} options={{ title: 'Timer Setup' }}/>
      <Stack.Screen name='SessionScreen' component={SessionScreen} options={{ title: 'Session' }}/>
    </Stack.Navigator>
  );
}

export default StackNavigations;
