import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';
import Button from '../Components/Button';
// import useNotification from '../hooks/useNotifications';

const SessionCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState('');
  const [mode, setMode] = useState('JOIN');
  // const sendNotification = useNotification()

  const socket = useSocket()
  const generateCode = () => {
    // console.warn('sending notificaton')
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
      userDetail = { ...userDetail, isCreator: true }
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

        <Button
          title={mode === 'JOIN' ? "Create Session" : "Have a Code?"}
          onPress={() => setMode(mode === 'JOIN' ? 'CREATE' : 'JOIN')}
          backgroundColor='#555' />
        {mode === 'CREATE' && (
          <Button
            title='Generate Code'
            onPress={generateCode}
            backgroundColor='#1A73E8'
          />
        )}
      </View>
      <Button
        title={mode === 'JOIN' ? 'Join' : 'Create'}
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