import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import RenderUserItem from '../Components/RenderUserItem'; // Adjust this import path as needed
import useNotification from '../hooks/useNotifications';
import * as Notifications from "expo-notifications";
import { sendNotificationHandler } from '../utils/sendNotification';



const CountdownScreen = ({ route }) => {
  const { sessionCode } = route.params;
  const [userTimes, setUserTimes] = useState([
    // Sort this according to totalSeconds initially, largest to smallest
    { id: 1, name: 'User 1', totalSeconds: 63, ready: false },
    { id: 2, name: 'User 2', totalSeconds: 54, ready: false },
    { id: 3, name: 'User 3', totalSeconds: 48, ready: false },
    { id: 4, name: 'User 4', totalSeconds: 39, ready: false },
    { id: 5, name: 'User 5', totalSeconds: 30, ready: false },
    { id: 6, name: 'User 6', totalSeconds: 20, ready: false },
    // Add more users
  ].sort((a, b) => b.totalSeconds - a.totalSeconds));

  const [allReady, setAllReady] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const sendNotification = useNotification();
  useEffect(() => {
    if (timerActive && allReady) {
      userTimes.forEach((item, index) => {
        if (index !== 0 && 
          !item.hasNotificationBeenSent && 
          userTimes[0].totalSeconds - item.totalSeconds === 5) { 

          console.log('Sending notification to ' + item.name);
          sendNotification(`${item.name}, your timer will start in 5 seconds`, 'Prepare yourself.', { key: 'value' });

          setUserTimes(currentTimes => {
            let newTimes = [...currentTimes];
            newTimes[index] = { ...newTimes[index], hasNotificationBeenSent: true };
            return newTimes;
          });
        }
      });
    }
  }, [userTimes, timerActive, allReady, sendNotification]);


  useEffect(() => {
    userTimes.forEach((item, index) => {
      if (userTimes[0].totalSeconds - item.totalSeconds === 5) {
        // console.warn('index ', index+ 1)
        console.log('index ', index+ 1)
        sendNotificationHandler(item.name,
          'body',
          { userName: 'ikram' },
          1
        )
      }
    })
  }, [userTimes]);

  useEffect(() => {
    setAllReady(userTimes.every(user => user.ready));
  }, [userTimes]);

  useEffect(() => {
    let intervalId;
    if (timerActive && allReady) {
      intervalId = setInterval(() => {
        setUserTimes(currentTimes => {
          let newTimes = [...currentTimes];
          let maxTime = newTimes[0]?.totalSeconds; 

          
          newTimes = newTimes.map((user, index) => {
            if (index === 0 || user.totalSeconds === maxTime) {
              return { ...user, totalSeconds: Math.max(user.totalSeconds - 1, 0) };
            }
            return user;
          });

          return newTimes;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [timerActive, allReady]);

  const handleUserReady = (userId) => {
    setUserTimes(prevState => prevState.map(user =>
      user.id === userId ? { ...user, ready: !user.ready } : user
    ));
  };

  const startSession = () => {
    if (!allReady) {
      alert('All users must be ready before starting the session.');
      return;
    }
    setTimerActive(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sessionCode}>Session Code: {sessionCode}</Text>
      <FlatList
        data={userTimes}
        renderItem={({ item }) => (
          <RenderUserItem
            item={item}
            handleReady={() => handleUserReady(item.id)}
          />
        )}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity
        onPress={startSession}
        style={[styles.startButton, { backgroundColor: allReady ? '#32CD32' : 'grey' }]}
        disabled={!allReady}
      >
        <Text style={styles.startButtonText}>Start Session</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingTop: 20,
  },
  sessionCode: {
    fontWeight: 'bold',
    fontSize: 28,
    color: '#4a4a4a',
    marginBottom: 20,
  },
  startButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 20,
    elevation: 4,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
});

export default CountdownScreen;
