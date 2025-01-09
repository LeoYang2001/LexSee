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
import {
  createUserWithEmailAndPassword,
  onIdTokenChanged,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../../firebase";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import ErrorComp from "../../components-shared/ErrorComp";
import SuccessComp from "../../components-shared/SuccessComp";
import { User } from "lucide-react-native";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cfmPassword, setCfmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [emailLabel, setEmailLabel] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState(false);
  const [cfmPasswordLabel, setCfmPasswordLabel] = useState(false);

  const emailLabelTop = useSharedValue(16);
  const emailLabelLeft = useSharedValue(0);
  const passwordLabelTop = useSharedValue(16);
  const passwordLabelLeft = useSharedValue(0);
  const cfmPasswordLabelTop = useSharedValue(16);
  const cfmPasswordLabelLeft = useSharedValue(0);

  // wait function
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

    // Confirm Password label animation
    cfmPasswordLabelTop.value = withTiming(cfmPasswordLabel ? -30 : 16, {
      duration: timeDur,
    });
    cfmPasswordLabelLeft.value = withTiming(cfmPasswordLabel ? -16 : 0, {
      duration: timeDur,
    });
  }, [emailLabel, passwordLabel, cfmPasswordLabel]);

  const handleSigningUp = () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!email || !password || !cfmPassword) {
      Keyboard.dismiss();
      Haptics.selectionAsync();
      setErrorMessage("Empty Field");
      return;
    }

    if (password !== cfmPassword) {
      Keyboard.dismiss();
      Haptics.selectionAsync();
      setErrorMessage("Passwords do not match");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        // Send email verification
        try {
          await sendEmailVerification(user);
          console.log("Verification email sent to:", user.email);
          setSuccessMessage("Acount successfully created");
          await wait(1000);
          navigation.navigate("EmailVerification");
        } catch (error) {
          console.error("Error sending verification email:", error);
          setErrorMessage("Failed to send verification email");
        }
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.code;
        Keyboard.dismiss();
        Haptics.selectionAsync();
        if (errorMessage == "auth/invalid-email") {
          setErrorMessage("Invalid email address");
        }
        if (errorMessage == "auth/weak-password") {
          setErrorMessage("Weak Password");
        }
        if (errorMessage == "auth/email-already-in-use") {
          setErrorMessage("Email already in use");
        } else {
          console.log(errorMessage);
          setErrorMessage("An error occured");
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="flex-1 flex px-10 items-center py-10 relative">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-between w-full mb-20"
        >
          <Text
            style={styles.outlinedText}
            className="text-5xl font-bold mt-14"
          >
            Sign Up
          </Text>
          <View className="pt-10">
            {/* Email Input */}
            <View className="mt-10 flex-row items-center rounded-2xl border-2 relative">
              <Animated.View
                style={{ top: emailLabelTop, left: emailLabelLeft }}
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
                style={{ top: passwordLabelTop, left: passwordLabelLeft }}
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

            {/* Confirm Password Input */}
            <View className="mt-10 flex-row items-center rounded-2xl border-2 relative">
              <Animated.View
                style={{ top: cfmPasswordLabelTop, left: cfmPasswordLabelLeft }}
                className="absolute ml-4 z-0"
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: cfmPasswordLabel ? "black" : "grey",
                  }}
                  className="font-semibold"
                >
                  Confirm Password
                </Text>
              </Animated.View>
              <TextInput
                onBlur={() => {
                  if (!cfmPassword) setCfmPasswordLabel(false);
                }}
                onFocus={() => setCfmPasswordLabel(true)}
                className="z-10 bg-transparent w-full py-4 px-4 rounded-2xl"
                value={cfmPassword}
                onChangeText={setCfmPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-black rounded-2xl flex justify-center items-center mt-10 py-4 px-4"
            onPress={handleSigningUp}
          >
            <Text className="text-white font-bold">Sign Up</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* Error Message Card */}
        <View className=" w-full absolute z-10 bottom-10">
          <ErrorComp
            timeDur={500}
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

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text>Already have an account?</Text>
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

export default SignUpScreen;
