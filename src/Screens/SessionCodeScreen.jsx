import React, { useState } from 'react';
import { View, TextInput, Button, TouchableOpacity, Text } from 'react-native';

const SessionCodeScreen = ({ navigation }) => {
  const [sessionCode, setSessionCode] = useState('');

  const generateSessionCode = () => {
    // Generate a new alphanumeric session code
    const newSessionCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    setSessionCode(newSessionCode);
  };

  const handleContinue = () => {
    // Navigate to the second screen
    navigation.navigate('SecondScreen');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20 }}
        placeholder="Enter session code"
        value={sessionCode}
        onChangeText={text => setSessionCode(text)}
      />
      <Button title="Generate New Code" onPress={generateSessionCode} />
      <TouchableOpacity onPress={handleContinue} style={{ marginTop: 20 }}>
        <Text style={{ color: 'blue', textDecorationLine: 'underline' }}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SessionCodeScreen;
