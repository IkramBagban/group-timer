import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

const Button = ({ onPress, title, backgroundColor}) => {
    return (
        <TouchableOpacity
        style={[styles.button, {backgroundColor : backgroundColor}]}
        onPress={onPress}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
      },
      buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
      },
})
export default Button