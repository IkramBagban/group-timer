import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'

const TimerSetupScreen = ({ navigation , route}) => {

  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const continueHandler = () => {
    if (!name || !parseInt(minutes) || parseInt(!seconds)) {
      return Alert.alert('field empty', 'All the fields are required!')
    }
    navigation.navigate('CountdownScreen', { name, minutes, seconds, sessionCode : route.params.sessionCode })
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TimerSetupScreen</Text>

      <View>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10 }}
          placeholder='Enter your name' value={name} onChangeText={setName} />
        <View style={{flexDirection : 'row'}}>
          <TextInput
            style={{ height: 40,width:50, borderColor: 'gray', borderWidth: 1,textAlign:'center', marginTop: 10 }}
            placeholder='00' value={minutes} keyboardType='numeric' onChangeText={setMinutes} />
          <TextInput
            style={{ height: 40,width:50, borderColor: 'gray', borderWidth: 1,textAlign:'center', marginTop: 10 }}
            placeholder='00' value={seconds} keyboardType='numeric' onChangeText={setSeconds} />
        </View>
      </View>
      <TouchableOpacity onPress={continueHandler} style={{width : 120, borderWidth : 1, padding : 3,textAlign :'center', backgroundColor : 'yellow', borderRadius :4, elevation : 4, marginTop : 3}}>
        <Text style={{textAlign :'center'}}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default TimerSetupScreen