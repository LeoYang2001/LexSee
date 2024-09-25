import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app, auth } from '../firebase';




const SignUpScreen = ({navigation}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [cfmPassowrd, setCfmPassowrd] = useState('')

    const handleSigningUp = ()=>{
        if(!email || !password || !cfmPassowrd) return alert('fill the blank input please!')
        else{
            if(password !== cfmPassowrd)    return alert('make sure the passwords are the same')
            else{

                createUserWithEmailAndPassword(auth, email, password)
                    .then((userCredential) => {
                        const user = userCredential.user;
                        console.log(user)
                    })
                    .catch((error)=>{
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        console.log(errorMessage)
                    })
            }
        }
    }
  return (
    <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
    >
        <View className="flex-1 border  bg-red-50 flex  items-center py-10">
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className=" flex-1  justify-center items-center ">
            <Text>SignUp</Text>
            <View>
            <TextInput value={email} onChangeText={setEmail} placeholder='Email'/>
            </View>
            <View>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder='Password'/>
            </View>
            <View>
            <TextInput value={cfmPassowrd} onChangeText={setCfmPassowrd} secureTextEntry placeholder='Confirm Password'/>
            </View> 
            <TouchableOpacity
                onPress={handleSigningUp}
            >
                <Text>SignUp</Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>

            <TouchableOpacity 
                onPress={()=>{
                    navigation.goBack()
                }}
            >
                <Text>Already have an account?</Text>
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
  )
}

export default SignUpScreen