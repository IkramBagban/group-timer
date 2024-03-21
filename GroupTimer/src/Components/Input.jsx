import { View, Text, TextInput } from 'react-native'
import React from 'react'

const Input = ({onChangeText, value, placeholder, keyboardType, height, width}) => {
    return (
        <TextInput
            style={{ height: height || 40, width: width || 50, borderColor: 'gray', borderWidth: 1, textAlign: 'center', marginTop: 10 }}
            placeholder={placeholder} value={value} keyboardType={keyboardType} onChangeText={onChangeText} />
    )
}

export default Input