import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler';

const CountdownScreen = ({ route }) => {

  let {  name, sessionCode } = route.params
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [timerOn, setTimerOn] = useState(false);

  useEffect(() => {
    const totalTime = parseInt(minutes) * 60 + parseInt(seconds)
    setTotalSeconds(totalTime)
// 
  }, [minutes, seconds])

  useEffect(() => {
    let interval;

    if (totalSeconds > 0 && timerOn) {
      interval = setInterval(() => {
        setTotalSeconds(totalSeconds => totalSeconds - 1);
      }, 1000);
    }else{
      clearInterval(interval)
    }

    return () => clearInterval(interval)
  }, [timerOn, totalSeconds])

  const startTimerHandler = () => {
    setTimerOn(true)
  }

  const minutes = Math.floor(totalSeconds/60)
  const seconds = totalSeconds % 60
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontWeight : 'bold'}}>{sessionCode}</Text>
      <Text>{name}</Text>
      <Text>{minutes> 9 ? minutes :'0' + minutes} : {seconds > 9 ? seconds :'0' + seconds}</Text>
      <TouchableOpacity onPress={startTimerHandler}>
        <Text>Start Timer</Text>
      </TouchableOpacity>
    </View>
  )
}

export default CountdownScreen