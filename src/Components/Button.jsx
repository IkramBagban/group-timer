import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({ onPress, title }) => {
    return (
        <TouchableOpacity onPress={onPress}
            style={{ width: 120, borderWidth: 1, padding: 3, textAlign: 'center', backgroundColor: 'yellow', borderRadius: 4, elevation: 4, marginTop: 3 }}>
            <Text style={{ textAlign: 'center' }}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button