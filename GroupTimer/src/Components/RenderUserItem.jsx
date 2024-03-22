import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RenderUserItem = ({ item, handleUserReady }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userTime}>{`${Math.floor(item.totalTime / 60).toString().padStart(2, '0')}:${(item.totalTime % 60).toString().padStart(2, '0')}`}</Text>
            <TouchableOpacity
                style={[styles.readyButton, { backgroundColor: item.isReady ? 'green' : '#007bff' }]}
                onPress={handleUserReady}
            >
                <Text style={styles.readyButtonText}>{item.isReady ? 'Ready' : 'Not Ready'}</Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 8,
    width: '95%',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#404040', 
  },
  userName: {
    color: '#EDEDED',
    fontSize: 18,
    fontWeight: '500',
  },
  userTime: {
    color: '#EDEDED',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 10,
  },
  readyButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#007AFF', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  readyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RenderUserItem;
