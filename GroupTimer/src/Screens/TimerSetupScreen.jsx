import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useSocket } from '../hooks/useSocket';

const TimerSetupScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const socket = useSocket();

  let { sessionCode, userDetail } = route.params
  const continueHandler = () => {
    const totalTime = parseInt(minutes || 0) * 60 + parseInt(seconds || 0);
    // if (!name.trim() || totalTime < 1) {
    //   return Alert.alert('Field Empty', 'Please fill out all fields and ensure the time is more than zero.');
    // }
    console.log('socket', socket)

    userDetail = { ...userDetail, name : name, totalTime : totalTime }

    navigation.navigate('CountdownScreen',{sessionCode,userDetail});
  };  

  return (
    <View style={styles.container}>
      <Text style={styles.screenTitle}>Timer Setup</Text>

      <TextInput
        style={styles.nameInput}
        placeholder='Enter your name'
        placeholderTextColor="#888"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.timeContainer}>
        <TextInput
          style={styles.timeInput}
          placeholder='MM'
          placeholderTextColor="#888"
          value={minutes}
          keyboardType='numeric'
          maxLength={2}
          onChangeText={setMinutes}
        />
        <Text style={styles.colon}>:</Text>
        <TextInput
          style={styles.timeInput}
          placeholder='SS'
          placeholderTextColor="#888"
          value={seconds}
          keyboardType='numeric'
          maxLength={2}
          onChangeText={setSeconds}
        />
      </View>
      <TouchableOpacity onPress={continueHandler} style={styles.continueButton}>
        <Text style={styles.continueButtonText}>
          Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  screenTitle: {
    fontSize: 24,
    color: '#E8E8E8',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  nameInput: {
    backgroundColor: '#252525',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    width: '80%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#353535',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeInput: {
    backgroundColor: '#252525',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    width: 70,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#353535',
  },
  colon: {
    fontSize: 20,
    color: '#E8E8E8',
    marginHorizontal: 8,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: '#FF6F00', // Using a vibrant color for action
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 40,
    elevation: 5,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default TimerSetupScreen;
