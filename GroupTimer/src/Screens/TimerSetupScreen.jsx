import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';

const TimerSetupScreen = ({ navigation, route }) => {
  let { sessionCode, userDetail } = route.params;

  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');

  const socket = useSocket();

  const handleContinue = () => {
    if (!name.trim() || !minutes.trim() || !seconds.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const totalTime = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
     userDetail = { ...userDetail,name, totalTime }; 

    // socket.emit('createSession', {sessionCode, userDetail}); 
    // const detail = { userId : userDetail.userId,name, totalTime }
    socket.emit('updateUser', { sessionCode, userDetail });


    // Navigate to CountdownScreen with user details and session code
    navigation.navigate('CountdownScreen', { sessionCode, userDetail });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Timer</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#BBBBBB"
        value={name}
        onChangeText={setName}
      />
      <View style={styles.timeContainer}>
        <TextInput
          style={[styles.input, { width: '40%' }]}
          placeholder="MM"
          keyboardType="numeric"
          value={minutes}
          onChangeText={setMinutes}
        />
        <TextInput
          style={[styles.input, { width: '40%' }]}
          placeholder="SS"
          keyboardType="numeric"
          value={seconds}
          onChangeText={setSeconds}
        />
      </View>
      <TouchableOpacity onPress={handleContinue} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#E8E8E8',
    marginBottom: 30,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#252525',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#353535',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#FF6F00',
    padding: 15,
    borderRadius: 20,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '500',
  },
});

export default TimerSetupScreen;
