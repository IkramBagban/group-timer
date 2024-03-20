import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RenderUserItem = ({ item, handleReady }) => {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userTime}>{`${Math.floor(item.totalSeconds / 60).toString().padStart(2, '0')}:${(item.totalSeconds % 60).toString().padStart(2, '0')}`}</Text>
            <TouchableOpacity
                style={[styles.readyButton, { backgroundColor: item.ready ? 'green' : '#007bff' }]}
                onPress={handleReady}
            >
                <Text style={styles.readyButtonText}>{item.ready ? 'Ready' : 'Not Ready'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
        borderRadius: 15,
        width: '90%',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    userName: {
        fontSize: 18,
        color: '#4a4a4a',
    },
    userTime: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#007bff',
    },
    readyButton: {
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
});

export default RenderUserItem;
