import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useSocket } from '../hooks/useSocket';

const SessionCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('JOIN');

  const socket = useSocket()
  const generateCode = () => {
    const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setCode(newCode);
  };

  const handleProceed = () => {
    if (!code) {
      Alert.alert('Code Required', mode === 'CREATE' ? 'Generate a code to create a session.' : 'Enter a code to join a session.');
      return;
    }

    const userId = code + Math.floor(Math.random() * 9000 + 100)
    let userDetail = { userId: userId, isCreator: false, isReady: false }

    if (mode === 'CREATE') {
      userDetail = {...userDetail, isCreator : true}
      return navigation.navigate('TimerSetupScreen', { sessionCode: code, userDetail });
    }
    navigation.navigate('TimerSetupScreen', { sessionCode: code, userDetail });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'JOIN' ? 'Join a Session' : 'Create a Session'}</Text>
      <View style={styles.actionContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter or generate a code"
          placeholderTextColor="#BBBBBB"
          value={code}
          onChangeText={setCode}
        />
        <TouchableOpacity
          style={[styles.button, styles.toggleButton]}
          onPress={() => setMode(mode === 'JOIN' ? 'CREATE' : 'JOIN')}
        >
          <Text style={styles.buttonText}>{mode === 'JOIN' ? "Create Session" : "Have a Code?"}</Text>
        </TouchableOpacity>
        {mode === 'CREATE' && (
          <TouchableOpacity
            style={[styles.button, styles.generateButton]}
            onPress={generateCode}
          >
            <Text style={styles.buttonText}>Generate Code</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity onPress={handleProceed} style={[styles.button, styles.proceedButton]}>
        <Text style={styles.buttonText}>{mode === 'JOIN' ? 'Join' : 'Create'}</Text>
      </TouchableOpacity>
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
  button: {
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  toggleButton: {
    backgroundColor: '#555',
  },
  generateButton: {
    backgroundColor: '#1A73E8',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  proceedButton: {
    backgroundColor: '#FFA500',
  },
});

export default SessionCodeScreen;
