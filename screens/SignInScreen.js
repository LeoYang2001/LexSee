import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import ErrorComp from "../components/ErrorComp";
import * as Haptics from "expo-haptics";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [emailLabel, setEmailLabel] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState(false); // New state for password label

  const emailLabelTop = useSharedValue(16);
  const emailLabelLeft = useSharedValue(0);
  const passwordLabelTop = useSharedValue(16); // New shared value for password label
  const passwordLabelLeft = useSharedValue(0); // New shared value for password label

  useEffect(() => {
    const timeDur = 300;
    // Email label animation
    emailLabelTop.value = withTiming(emailLabel ? -30 : 16, {
      duration: timeDur,
    });
    emailLabelLeft.value = withTiming(emailLabel ? -16 : 0, {
      duration: timeDur,
    });

    // Password label animation
    passwordLabelTop.value = withTiming(passwordLabel ? -30 : 16, {
      duration: timeDur,
    });
    passwordLabelLeft.value = withTiming(passwordLabel ? -16 : 0, {
      duration: timeDur,
    });
  }, [emailLabel, passwordLabel]); // Update dependency array

  //fade in and out effect for error message

  const signIn = async () => {
    setErrorMessage("");
    if (!email || !password) {
      Keyboard.dismiss();
      Haptics.selectionAsync();
      setErrorMessage("Empty Field");
      return;
    }

    signInWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(JSON.stringify(user));
        // Check if the user's email is verified
        if (user.emailVerified) {
          navigation.navigate("DrawerEntry"); // Navigate to the main app if verified
        } else {
          navigation.navigate("EmailVerification"); // Navigate to email verification screen if not verified
        }
      })
      .catch((error) => {
        Haptics.selectionAsync();
        Keyboard.dismiss();
        // Set a user-friendly error message
        if (error.code === "auth/invalid-email") {
          setErrorMessage("Invalid email address");
        } else if (error.code === "auth/wrong-password") {
          setErrorMessage("Incorrect password");
        } else if (error.code === "auth/invalid-credential") {
          setErrorMessage("Invalid credential");
        } else if ("auth/too-many-requests") {
          setErrorMessage("Too many requests");
        } else {
          console.log(error);
          setErrorMessage("An error occurred");
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 relative  flex px-10 items-center py-10">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-between w-full mb-40"
        >
          <Text
            style={styles.outlinedText}
            className="text-5xl font-bold mt-14"
          >
            Sign In
          </Text>
          <View className="mb-10">
            {/* Email Input */}
            <View className="mt-10 flex-row items-center rounded-2xl border-2 relative">
              <Animated.View
                style={{
                  top: emailLabelTop,
                  left: emailLabelLeft,
                }}
                className="absolute ml-4 z-0"
              >
                <Text
                  style={{ fontSize: 14, color: emailLabel ? "black" : "grey" }}
                  className="font-semibold"
                >
                  Email
                </Text>
              </Animated.View>
              <TextInput
                onBlur={() => {
                  if (!email) setEmailLabel(false);
                }}
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
                <Text
                  style={{
                    fontSize: 14,
                    color: passwordLabel ? "black" : "grey",
                  }}
                  className="font-semibold"
                >
                  Password
                </Text>
              </Animated.View>
              <TextInput
                onBlur={() => {
                  if (!password) setPasswordLabel(false);
                }}
                onFocus={() => setPasswordLabel(true)}
                className="z-10 bg-transparent w-full py-4 px-4 rounded-2xl"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              disabled={errorMessage}
              className="bg-black rounded-2xl flex justify-center items-center mt-10 py-4 px-4"
              onPress={signIn}
            >
              <Text className="text-white font-bold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Error Message Card */}
        <View className=" w-full absolute z-10 bottom-10">
          <ErrorComp
            timeDur={300}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignUp");
          }}
        >
          <Text>Don't have an account?</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  outlinedText: {
    color: "white",
    textShadowColor: "black",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});

export default SignInScreen;
