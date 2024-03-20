import React, { useState, useEffect, Platform } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import Button from '../Components/Button';
import { sendNotificationHandler } from '../utils/sendNotification';



const SessionCodeScreen = ({ navigation }) => {
  


  const [sessionCode, setSessionCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const generateSessionCode = () => {
   

    const newSessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(newSessionCode);
  };

  const handleContinue = () => {
    if (!sessionCode) return Alert.alert('Session Code Error', 'Session Code is required. create session or join')
    navigation.navigate('TimerSetupScreen', { sessionCode });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View>
        <TextInput
          style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20 }}
          placeholder="Enter session code"
          value={sessionCode}
          onChangeText={text => setSessionCode(text)}
        />
        <Button title={isCreating ? "Have Session Code?" : "Create session"} onPress={() => setIsCreating(!isCreating)} />
      </View>
      {
        isCreating ?
          <Button title="Generate New Code" onPress={generateSessionCode} />
          : null
      }
      <TouchableOpacity onPress={handleContinue} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>{isCreating ? 'Create' : 'Join'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SessionCodeScreen;
