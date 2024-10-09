import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';

const SignInScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailLabel, setEmailLabel] = useState(false);
    const [passwordLabel, setPasswordLabel] = useState(false); // New state for password label

    const emailLabelTop = useSharedValue(16);
    const emailLabelLeft = useSharedValue(0);
    const passwordLabelTop = useSharedValue(16); // New shared value for password label
    const passwordLabelLeft = useSharedValue(0); // New shared value for password label

    useEffect(() => {
        const timeDur = 300;
        // Email label animation
        emailLabelTop.value = withTiming(emailLabel ? -30 : 16, { duration: timeDur });
        emailLabelLeft.value = withTiming(emailLabel ? -16 : 0, { duration: timeDur });

        // Password label animation
        passwordLabelTop.value = withTiming(passwordLabel ? -30 : 16, { duration: timeDur });
        passwordLabelLeft.value = withTiming(passwordLabel ? -16 : 0, { duration: timeDur });
    }, [emailLabel, passwordLabel]); // Update dependency array

    const signIn = async () => {
        if (!email || !password) return;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(JSON.stringify(user));
                if (user.uid) {
                    navigation.navigate('DrawerEntry');
                }
            })
            .catch((error) => {
                const errorMessage = error.message;
                console.log(errorMessage);
            });
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 flex px-10 items-center py-10">
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 justify-between w-full mb-40">
                    <Text style={styles.outlinedText} className="text-5xl font-bold mt-14">Sign In</Text>
                    <View className="mb-10" >

                    {/* Email Input */}
                    <View className="mt-10 flex-row items-center rounded-2xl border-2 relative">
                        <Animated.View
                            style={{
                                top: emailLabelTop,
                                left: emailLabelLeft,
                            }}
                            className="absolute ml-4 z-0"
                        >
                            <Text style={{ fontSize: 14, color: emailLabel ? 'black' : 'grey' }} className="font-semibold">
                                Email
                            </Text>
                        </Animated.View>
                        <TextInput
                            onBlur={() => { if (!email) setEmailLabel(false); }}
                            onFocus={() => setEmailLabel(true)}
                            className="z-10 bg-transparent w-full py-4 px-4 rounded-2xl"
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Password Input */}
                    <View className="mt-10 flex-row items-center rounded-2xl border-2 relative">
                        <Animated.View
                            style={{
                                top: passwordLabelTop,
                                left: passwordLabelLeft,
                            }}
                            className="absolute ml-4 z-0"
                        >
                            <Text style={{ fontSize: 14, color: passwordLabel ? 'black' : 'grey' }} className="font-semibold">
                                Password
                            </Text>
                        </Animated.View>
                        <TextInput
                            onBlur={() => { if (!password) setPasswordLabel(false); }}
                            onFocus={() => setPasswordLabel(true)}
                            className="z-10 bg-transparent w-full py-4 px-4 rounded-2xl"
                            value={password}
                            onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity 
                        className="bg-black rounded-2xl flex justify-center items-center mt-10 py-4 px-4 "
                        onPress={signIn}>
                            <Text className="text-white font-bold">Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>

                <TouchableOpacity onPress={() => { navigation.navigate('SignUp'); }}>
                    <Text>Don't have an account?</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    outlinedText: {
        color: 'white',
        textShadowColor: 'black',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 1,
    },
});

export default SignInScreen;
