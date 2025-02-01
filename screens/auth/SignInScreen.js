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
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import * as Haptics from "expo-haptics";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import ErrorComp from "../../components-shared/ErrorComp";
import SuccessComp from "../../components-shared/SuccessComp";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [emailLabel, setEmailLabel] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState(false); // New state for password label

  const emailLabelTop = useSharedValue(16);
  const emailLabelLeft = useSharedValue(0);
  const passwordLabelTop = useSharedValue(16); // New shared value for password label
  const passwordLabelLeft = useSharedValue(0); // New shared value for password label

  const [isSigningIn, setisSigningIn] = useState(false);

  const handlePasswordReset = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (email) {
      try {
        await sendPasswordResetEmail(auth, email);
        setSuccessMessage("Password reset email sent");
      } catch (error) {
        console.log(error.code);
        if (error.code == "auth/user-not-found") {
          setAlertMessage("No user found with this email");
        } else {
          setErrorMessage("Error sending password reset email");
          console.log(error);
        }
      }
    } else {
      setErrorMessage("Please enter your email");
    }
  };

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
    setisSigningIn(true);
    signInWithEmailAndPassword(auth, email.trim(), password.trim())
      .then((userCredential) => {
        const user = userCredential.user;
        // Check if the user's email is verified
        if (user.emailVerified) {
          try {
            navigation.navigate("DrawerEntry"); // Navigate to the main app if verified
          } catch (error) {
            console.log(error);
            setisSigningIn(false);
          }
        } else {
          navigation.navigate("EmailVerification"); // Navigate to email verification screen if not verified
        }
      })
      .catch((error) => {
        setisSigningIn(false);
        Haptics.selectionAsync();
        Keyboard.dismiss();
        console.log(error);
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
      <View className="bg-black h-full w-full">
        {/* background */}
        <ImageBackground
          style={{ height: "75%" }}
          source={require("../../assets/signInBackground.png")}
          resizeMode="cover"
          className="flex flex-col justify-center"
        ></ImageBackground>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="justify-around w-full h-full absolute px-4"
        >
          <View className="h-40"></View>
          <Text style={styles.registerText} className="text-white">
            Sign in
          </Text>
          {/* inputs */}
          <View>
            <Text className="mt-5 py-1" style={styles.emailText}>
              Email
            </Text>
            <View className="flex-row items-center rounded-2xl relative">
              <TextInput
                className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <Text className="mt-5 py-1" style={styles.emailText}>
              Password
            </Text>
            <View className="flex-row items-center relative">
              <TextInput
                className="w-full py-4 px-4 rounded-2xl bg-white/10 backdrop-blur-lg text-white"
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>
          {/* sign in button */}
          <View>
            <View className="py-4">
              <TouchableOpacity
                style={styles.registerButton}
                className="w-full py-4 px-4 items-center"
                onPress={signIn}
              >
                <Text style={styles.registerButtonText}>Sign in</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
              className="flex-row justify-center items-center"
            >
              <Text style={styles.SignInText}>Don't have an account? </Text>
              <Text className="font-semibold text-white">Register</Text>
            </TouchableOpacity>
          </View>
          <View className="h-10"></View>
        </KeyboardAvoidingView>
        {/* Logo */}
        <View className="absolute bottom-5 w-full flex-row justify-center">
          <Image
            style={{ height: 24, width: 60 }}
            source={require("../../assets/LexSeeSignInLogo.png")}
            resizeMode="cover"
          ></Image>
        </View>

        {/* Error Message Card */}
        <View className=" w-full absolute z-10 bottom-10">
          <ErrorComp
            timeDur={300}
            setErrorMessage={setErrorMessage}
            errorMessage={errorMessage}
          />
        </View>

        {/* Success Message Card */}
        <View className=" w-full absolute z-10 bottom-10">
          <SuccessComp
            timeDur={500}
            setSuccessMessage={setSuccessMessage}
            successMessage={successMessage}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  registerText: {
    fontSize: 28,
    fontWeight: "600",
    color: "white",
  },
  emailText: {
    fontSize: 14,
    color: "white",
    opacity: 0.7,
  },
  registerButton: {
    backgroundColor: "#FA541C",
    borderRadius: 9,
  },
  registerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  SignInText: {
    fontSize: 14,
    color: "white",
    opacity: 0.7,
  },
});

export default SignInScreen;
