import { View, Text, FlatList, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';
import RenderUserTimes from '../Components/RenderUserItem';





// console.log(userData);

const CountdownScreen = ({ route }) => {

  // let { name, sessionCode, totalTime } = route.params
  let { totalTime, sessionCode } = route.params
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [userTimes, setUserTimes] = useState([
    { id: 1, name: 'User 1', totalSeconds: 69, ready: false },
    { id: 2, name: 'User 2', totalSeconds: 59, ready: false },
    { id: 3, name: 'User 3', totalSeconds: 40, ready: false },
    { id: 4, name: 'User 4', totalSeconds: 39, ready: false },
    { id: 5, name: 'User 5', totalSeconds: 34, ready: false },
    { id: 6, name: 'User 6', totalSeconds: 20, ready: false },
    { id: 7, name: 'User 7', totalSeconds: 10, ready: false }
  ]);

  useEffect(() => {
    const isReady = userTimes.every(user => user.ready === true)
    console.log
    if (isReady) {
      setIsReadyToStart(isReady)
    }
  }, [JSON.stringify(userTimes)])

  

  const startTimerHandler = () => {
    setTimerOn(true)
  }

  const handleReady = (userId) => {
    setUserTimes(prevState =>
      prevState.map(user =>
        user.id === userId ? { ...user, ready: true } : user
      )
    );
  };


  return (
    <View style={styles.container}>
      <Text style={styles.sessionCode}>{sessionCode}</Text>
      <FlatList
        data={userTimes}
        renderItem={({ item }) => <RenderUserTimes timerOn={timerOn} item={item} firstItem={userTimes[0]} handleReady={handleReady} />}
        keyExtractor={item => item.id.toString()}
      />
      <TouchableOpacity onPress={startTimerHandler} style={[styles.startButton, { backgroundColor: isReadyToStart ? '#ff4500' : 'grey' }]}>
        <Text style={styles.startButtonText}>Start Timer</Text>
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
    marginBottom: 40,
    paddingHorizontal: 20,
    textAlign: 'center',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#007bff',
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 15,
    width: '95%',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 3,
  },
  userName: {
    fontSize: 18,
    color: '#4a4a4a',
    maxWidth: '50%',
  },
  userTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007bff',
  },
  readyButton: {
    backgroundColor: '#32CD32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    elevation: 2,
  },
  readyButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#ff4500',
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