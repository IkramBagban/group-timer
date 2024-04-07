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


  // Update user's app state in the backend
  useEffect(() => {
    setUserDetail(prev => ({ ...prev, appState }));
    // Emit an event to update the app state in the backend
    socket.emit("user:updateAppState", { sessionCode, userId: userDetail.userId, appState });

  }, [socket, sessionCode, userDetail.userId, appState]);

  // Listen for session updates and clean up
  useEffect(() => {
    const updateUsers = (users) => {
      setUserTimes(users.sort((a, b) => b.totalTime - a.totalTime));
      setAllReady(users.every(user => user.isReady));
    };

    if (!socket) return

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
