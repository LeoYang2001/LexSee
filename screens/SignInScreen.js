import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';


const SignInScreen = ({navigation}) => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const signIn = async ()=>{

        if(!email || !password) return

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(JSON.stringify(user))
            if(user.uid)
            {
                navigation.navigate('DrawerEntry')
            }
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
          });


    }

  return (
    <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
    >
        <View className="flex-1 border  bg-red-50 flex  items-center py-10">
            <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className=" flex-1  justify-center items-center ">
            <Text>SignIn</Text>
            <View>
            <TextInput value={email} onChangeText={setEmail} placeholder='Email'/>
            </View>
            <View>
            <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder='Password'/>
            </View>
            
            <TouchableOpacity
                onPress={signIn}
            >
                <Text>SignIn</Text>
            </TouchableOpacity>
            </KeyboardAvoidingView>

            <TouchableOpacity 
                onPress={()=>{
                    navigation.navigate('SignUp')
                }}
            >
                <Text>Dont have an account?</Text>
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
  )
}

export default SignInScreen