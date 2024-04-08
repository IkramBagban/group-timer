// import React, { useEffect, useState } from 'react';
// import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
// import { useSocket } from '../Context/SocketContext';
// import RenderUserItem from '../Components/RenderUserItem';
// import { usePushToken } from '../Context/PushTokenContext';
// import { useAppState } from '../hooks/useAppState';

// const SessionScreen = ({ route, navigation }) => {
//   const { sessionCode } = route.params;
//   const { pushToken } = usePushToken();
//   const appState = useAppState();
//   const socket = useSocket();
  
//   const [userDetails, setUserDetails] = useState([]);
//   const [sessionStarted, setSessionStarted] = useState(false);
  
//   // Derived state for UI rendering to reduce complexity
//   const userDetail = userDetails.find(user => user.userId === route.params.userDetail.userId);
//   const allReady = userDetails.every(user => user.isReady);
//   const canStartSession = allReady && !sessionStarted && userDetails.length > 1;

//   // Combine state updates related to user details into a single useEffect
//   useEffect(() => {
//     const updateUsers = (users) => {
//       setUserDetails(users.sort((a, b) => b.totalTime - a.totalTime));
//     };

//     const handleSessionUpdate = (users) => updateUsers(users);
//     const handleDisconnect = () => socket.emit('session:leave', sessionCode, socket.id);

//     socket.on('sessionUpdate', handleSessionUpdate);
//     return () => {
//       handleDisconnect();
//       socket.off('sessionUpdate', handleSessionUpdate);
//     };
//   }, [socket, sessionCode]);

//   // Update app state and listen for session end
//   useEffect(() => {
//     socket.emit("user:updateAppState", { sessionCode, userId: route.params.userDetail.userId, appState });

//     if (userDetails.length === 0 || !socket.connected) return;

//     const timerEnd = userDetails[0]?.totalTime === 0;
//     if (timerEnd) {
//       setTimeout(() => navigation.navigate('SessionCode'), 5000);
//     }
//   }, [appState, userDetails, socket.connected, navigation]);

//   const handleUserReady = (userId) => {
//     if(userDetail.userId === userId)
//     socket.emit('user:ready', { sessionCode, userId: userDetail?.userId });
//   };

//   const startSession = () => {
//     if (!canStartSession) return;
//     socket.emit('session:startCountdown', sessionCode);
//     setSessionStarted(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sessionCode}>Session Code: {sessionCode}</Text>
//       <FlatList
//         data={userDetails}
//         renderItem={({ item }) => <RenderUserItem item={item} handleUserReady={handleUserReady} />}
//         keyExtractor={item => `${item.userId}${item.name}`}
//       />
//       {userDetail?.isCreator && (
//         <TouchableOpacity
//           onPress={startSession}
//           style={[styles.startButton, canStartSession ? { backgroundColor: '#32CD32' } : { backgroundColor: 'grey' }]}
//           disabled={!canStartSession}
//         >
//           <Text style={styles.startButtonText}>Start Session</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';

import RenderUserItem from '../Components/RenderUserItem';
import { usePushToken } from '../Context/PushTokenContext';
import { useAppState } from '../hooks/useAppState';

const SessionScreen = ({ route, navigation }) => {
  const { sessionCode, userDetail: initialUserDetail } = route.params;

  const { pushToken } = usePushToken();
  const appState = useAppState()
  const socket = useSocket();

  const [userDetail, setUserDetail] = useState({ ...initialUserDetail, appState });
  const [userTimes, setUserTimes] = useState([]);
  const [allReady, setAllReady] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  console.log('userdetail', userDetail)
  // Update user's app state in the backend
  useEffect(() => {
    setUserDetail(prev => ({ ...prev, appState }));
    // Emit an event to update the app state in the backend
    socket.emit("user:updateAppState", { sessionCode, userId: userDetail.userId, appState });

  }, [socket, sessionCode, userDetail.userId, appState]);

  // Listen for session updates and clean up
  useEffect(() => {
    const updateUsers = (users) => {
      console.log('users', users)
      setUserTimes(users.sort((a, b) => b.totalTime - a.totalTime));
      setAllReady(users.every(user => user.isReady));
    };

    if (!socket) return console.log('socket error')

    socket.on('sessionUpdate', updateUsers);

    return () => {
      if (socket) {
        socket.emit('session:leave', sessionCode, socket.id);
        socket.off('sessionUpdate', updateUsers);
      }
    };
  }, [socket]);

  // navigate back to session code screen after a delay.
  useEffect(() => {
    
    if (userTimes.length === 0 || !socket.connected) return;

    userTimes.forEach(u => {
      if (u.userId === userDetail.userId) {
        setUserDetail(u)
      }
    });

    const firstUserTime = userTimes[0]?.totalTime;
    if (firstUserTime === 0) {
      setTimeout(() => navigation.navigate('SessionCode'), 5000);
    }

  }, [userTimes, socket.connected, navigation, pushToken]);

  // Mark the user as ready within the session.
  const handleUserReady = useCallback((item) => {
    if (item.userId === userDetail.userId)
      socket.emit('user:ready', { sessionCode, userId: userDetail.userId });
  }, [socket, sessionCode, userDetail]);

  // Start the session countdown if all users are ready.
  const startSession = () => {
    if (!allReady) {
      Alert.alert('All users must be ready before starting the session.');
      return;
    }

    socket.emit('session:startCountdown', sessionCode);
    setSessionStarted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sessionCode}>Session Code: {sessionCode}</Text>
      <FlatList
        data={userTimes}
        renderItem={({ item }) => <RenderUserItem item={item} handleUserReady={() => handleUserReady(item)} />}
        keyExtractor={item => item.userId?.toString() + item.name}
      />

      {userDetail.isCreator && (<>
        {userTimes.length <= 1 ? <Text style={{ color: 'grey' }}>Game Requires more than one player to start</Text> : ''}
        <TouchableOpacity
          onPress={startSession}
          style={[styles.startButton, (sessionStarted || userTimes.length <= 1) ? { backgroundColor: 'grey' } : (allReady ? { backgroundColor: '#32CD32' } : { backgroundColor: 'grey' })]}
          disabled={!allReady || sessionStarted || userTimes.length <= 1} // Disable button if not all ready or session already started
        >
          <Text style={styles.startButtonText}>Start Session</Text>
        </TouchableOpacity>
      </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  sessionCode: {
    fontSize: 24,
    color: '#EDEDED',
    marginBottom: 20,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
  },

  startButton: {
    marginTop: 20,
    backgroundColor: '#FF6F00',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default SessionScreen;
