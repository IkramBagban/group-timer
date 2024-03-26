// import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
// import React, { useState } from 'react';
// import { TextInput } from 'react-native-gesture-handler';
// import { useSocket } from '../hooks/useSocket';

// const TimerSetupScreen = ({ navigation, route }) => {
//   const [name, setName] = useState('');
//   const [minutes, setMinutes] = useState('');
//   const [seconds, setSeconds] = useState('');
//   const socket = useSocket();

//   let { sessionCode, userDetail } = route.params
//   const continueHandler = () => {
//     const totalTime = parseInt(minutes || 0) * 60 + parseInt(seconds || 0);
//     // if (!name.trim() || totalTime < 1) {
//     //   return Alert.alert('Field Empty', 'Please fill out all fields and ensure the time is more than zero.');
//     // }
//     userDetail = { ...userDetail, name : name, totalTime : totalTime }

//     socket.emit('createSession', {sessionCode, userDetail}); 

//     socket.on('sessionData', data => {
//         console.log('session data', data);
//         navigation.navigate('CountdownScreen', {sessionCode, userDetail});
//     });


//     // navigation.navigate('CountdownScreen',{sessionCode,userDetail});
//   };  

//   return (
//     <View style={styles.container}>
//       <Text style={styles.screenTitle}>Timer Setup</Text>

//       <TextInput
//         style={styles.nameInput}
//         placeholder='Enter your name'
//         placeholderTextColor="#888"
//         value={name}
//         onChangeText={setName}
//       />
//       <View style={styles.timeContainer}>
//         <TextInput
//           style={styles.timeInput}
//           placeholder='MM'
//           placeholderTextColor="#888"
//           value={minutes}
//           keyboardType='numeric'
//           maxLength={2}
//           onChangeText={setMinutes}
//         />
//         <Text style={styles.colon}>:</Text>
//         <TextInput
//           style={styles.timeInput}
//           placeholder='SS'
//           placeholderTextColor="#888"
//           value={seconds}
//           keyboardType='numeric'
//           maxLength={2}
//           onChangeText={setSeconds}
//         />
//       </View>
//       <TouchableOpacity onPress={continueHandler} style={styles.continueButton}>
//         <Text style={styles.continueButtonText}>
//           Continue
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#121212',
//   },
//   screenTitle: {
//     fontSize: 24,
//     color: '#E8E8E8',
//     marginBottom: 30,
//     fontWeight: 'bold',
//   },
//   nameInput: {
//     backgroundColor: '#252525',
//     color: '#FFF',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 20,
//     fontSize: 16,
//     width: '80%',
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#353535',
//   },
//   timeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   timeInput: {
//     backgroundColor: '#252525',
//     color: '#FFF',
//     paddingHorizontal: 15,
//     paddingVertical: 10,
//     borderRadius: 20,
//     fontSize: 16,
//     width: 70,
//     textAlign: 'center',
//     borderWidth: 1,
//     borderColor: '#353535',
//   },
//   colon: {
//     fontSize: 20,
//     color: '#E8E8E8',
//     marginHorizontal: 8,
//   },
//   continueButton: {
//     marginTop: 30,
//     backgroundColor: '#FF6F00', // Using a vibrant color for action
//     borderRadius: 20,
//     paddingVertical: 10,
//     paddingHorizontal: 40,
//     elevation: 5,
//   },
//   continueButtonText: {
//     color: '#FFF',
//     fontSize: 18,
//     fontWeight: '500',
//   },
// });

// export default TimerSetupScreen;




import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';
// import { useSocket } from '../hooks/useSocket'; // Ensure this hook is correctly implemented

const TimerSetupScreen = ({ navigation, route }) => {
  let { sessionCode, userDetail } = route.params;
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const socket = useSocket();

  console.log('user detail', userDetail)
  const handleContinue = () => {
    if (!name.trim() || !minutes.trim() || !seconds.trim()) {
      alert('Please fill all fields.');
      return;
    }

    const totalTime = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
     userDetail = { ...userDetail,name, totalTime }; // Assuming these are the details you want to track

    socket.emit('createSession', {sessionCode, userDetail}); 

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
