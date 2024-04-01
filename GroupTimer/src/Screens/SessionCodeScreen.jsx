import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';
import Button from '../Components/Button';
import useNotification from '../hooks/useNotifications';

const SessionCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const socket = useSocket()

  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(newCode);
  };
  const handleProceed = () => {
    if (!code) {
      Alert.alert('Code Required', 'Enter a code to join a session.');
      return;
    }

    socket.emit('doesSessionExist', code);

    const userId = code + Math.floor(Math.random() * 9000 + 100);
    let userDetail = { userId: userId, isCreator: false, isReady: false };

    socket.once('isExistingSession', isExistingSession => {
      if (!isExistingSession) {

        userDetail.isCreator = true;
      }
      socket.emit('createSession', { sessionCode: code, userDetail });
      navigation.navigate('TimerSetupScreen', { sessionCode: code, userDetail });
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Join a Session</Text>
      <View style={styles.actionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter or generate a code"
          placeholderTextColor="#BBBBBB"
          value={code}
          onChangeText={setCode}
        />

        <Button
          title='Generate Code'
          onPress={generateCode}
          backgroundColor='#1A73E8'
        />
      </View>
      <Button
        title='Join'
        onPress={handleProceed}
        backgroundColor='#FFA500'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#333',
    color: '#FFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: '#444',
    borderWidth: 1,
    fontSize: 16,
    width: '100%',
    marginBottom: 20,
  },
});

export default SessionCodeScreen;