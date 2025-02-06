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
import { BlurView } from "expo-blur";

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
      <View className="bg-black h-full w-full">
        {/* background */}
        <ImageBackground
          style={{ height: "78%" }}
          source={require("../../assets/signUpBackground.png")}
          resizeMode="cover"
          className="flex flex-col justify-center"
        ></ImageBackground>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="justify-around w-full h-full absolute px-4"
        >
          <View className="h-40"></View>
          <Text style={styles.registerText} className="text-white">
            Register with Email
          </Text>
          {/* inputs */}
          <View className="py-5">
            <Text className="mt-5 py-1 " style={styles.emailText}>
              Email
            </Text>
            <View className="flex-row items-center rounded-2xl relative">
              <View
                style={{ borderRadius: 16, overflow: "hidden" }}
                className="w-full"
              >
                <BlurView className="py-4 px-4 bg-white/10">
                  <TextInput
                    className=" text-white"
                    value={email}
                    onChangeText={setEmail}
                  />
                </BlurView>
              </View>
            </View>
            <Text className="mt-5 py-1" style={styles.emailText}>
              Password
            </Text>
            <View className="flex-row items-center relative">
              <View
                style={{ borderRadius: 16, overflow: "hidden" }}
                className="w-full"
              >
                <BlurView className="py-4 px-4 bg-white/10">
                  <TextInput
                    className=" text-white"
                    value={password}
                    onChangeText={setPassword}
                  ></TextInput>
                </BlurView>
              </View>
            </View>
            <Text className="mt-5 py-1" style={styles.emailText}>
              Confirm Password
            </Text>
            <View className="flex-row items-center relative">
              <View
                style={{ borderRadius: 16, overflow: "hidden" }}
                className="w-full"
              >
                <BlurView className="py-4 px-4 bg-white/10">
                  <TextInput
                    className="text-white"
                    value={cfmPassword}
                    onChangeText={setCfmPassword}
                  />
                </BlurView>
              </View>
            </View>
          </View>
          {/* Register button */}
          <View>
            <View className="py-4">
              <TouchableOpacity
                style={styles.registerButton}
                className="w-full py-4 px-4 items-center"
                onPress={handleSigningUp}
              >
                <Text style={styles.registerButtonText}>Register</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}
              className="flex-row justify-center items-center"
            >
              <Text style={styles.SignInText}>Already have an account? </Text>
              <Text className="font-semibold text-white">Sign In</Text>
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

export default SignUpScreen;
