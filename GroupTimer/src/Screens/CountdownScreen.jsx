import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useSocket } from '../Context/SocketContext';
import RenderUserItem from '../Components/RenderUserItem';
import useNotification from '../hooks/useNotifications';

const CountdownScreen = ({ route, navigation }) => {
  const { sessionCode, userDetail } = route.params;

  const [userTimes, setUserTimes] = useState([]);
  const [allReady, setAllReady] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  // const [notificationSent, setNotificationSent] = useState(false);

  const socket = useSocket();
  const sendNotification = useNotification();
  // console.log('userties', userTimes.length)


  useEffect(() => {
    const updateUsers = (users) => {
      setUserTimes(users.sort((a, b) => b.totalTime - a.totalTime));
      setAllReady(users.every(user => user.isReady));
    };

    const handleStartingSession = (user) => {
      console.log('sending notification to zzzzz')

      if (user.userId === userDetail.userId) {
        console.log('sending notification to ' + user.name)
        sendNotification("Timer about to start", 'Your timer will start after 5 seconds');
      }
    };

    const handleSessionEnded = (allUsers) => {

      // if (notificationSent) return; // Prevent sending multiple notifications
      let notificationSent = false;
      for(let user of allUsers){
        if (user.userId === userDetail.userId) {
              console.log('user complete', user);
              if (!notificationSent) {
                console.log('called notifcationsent', notificationSent)
                sendNotification("Complete", 'Timer has been completed');
                notificationSent = true
              }
            }
      }
     
      setTimeout(() => {
        navigation.navigate('SessionCode')
        console.log(`Session ${sessionCode} removed after ending.`);
      }, 3000);
    };

    if (!socket) return


    socket.on('startingSession', handleStartingSession);
    socket.on('sessionUpdate', updateUsers);
    socket.on('sendNotification', handleStartingSession);
    socket.on('sessionEnded', handleSessionEnded);

    return () => {
      if (socket) {
        socket.emit('removeFromSession', sessionCode, socket.id);
        socket.off('startingSession', handleStartingSession);
        socket.off('sessionUpdate', updateUsers);
        socket.off('sendNotification', handleStartingSession);
        socket.off('sessionEnded', handleSessionEnded);
      }
    };
  }, [socket]);

  const handleUserReady = useCallback((item) => {
    if (item.userId === userDetail.userId)
      socket.emit('userReady', { sessionCode, userId: userDetail.userId });
  }, [socket, sessionCode, userDetail]);


  const startSession = () => {
    if (!allReady) {
      Alert.alert('All users must be ready before starting the session.');
      return;
    }

    socket.emit('startSession', sessionCode);
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

        // style={[styles.startButton, { backgroundColor: allReady ? '#32CD32' : 'grey' }]}
        // disabled={!allReady}
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

export default CountdownScreen;
