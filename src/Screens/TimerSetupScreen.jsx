import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import Input from '../Components/Input';

const TimerSetupScreen = ({ navigation, route }) => {

  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const continueHandler = () => {
    const totalTime = parseInt(minutes || 0) * 60 + parseInt(seconds || 0)
    if (!name || (totalTime < 1)) {
      return Alert.alert('field empty', 'All the fields are required!')
    }


    navigation.navigate('CountdownScreen', { name, totalTime, sessionCode: route.params.sessionCode })
  }
  console.log('minutes', minutes)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TimerSetupScreen</Text>

      <View>
        <Input width={100} placeholder='Enter your name' value={name} onChangeText={setName} />
        <View style={{ flexDirection: 'row' }}>

          <Input placeholder='00' value={minutes} keyboardType='numeric' onChangeText={setMinutes} />
          <Input placeholder='00' value={seconds} keyboardType='numeric' onChangeText={setSeconds} />
        </View>
      </View>
      <TouchableOpacity onPress={continueHandler} style={{ width: 120, borderWidth: 1, padding: 3, textAlign: 'center', backgroundColor: 'yellow', borderRadius: 4, elevation: 4, marginTop: 3 }}>
        <Text style={{ textAlign: 'center' }}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default TimerSetupScreen