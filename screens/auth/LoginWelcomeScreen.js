import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

const LoginWelcomeScreen = ({ navigation }) => {
  const description =
    "Welcome to LexSee, where you can explore AI-driven definitions and visualize words with captivating images to enhance your English learning experience!";
  const [displayedText, setDisplayedText] = useState("");

  const offSetLeft = useSharedValue(-300);

  useEffect(() => {
    if (displayedText.length > 0) return;

    offSetLeft.value = withSpring(0, {
      mass: 3.5,
    });

    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < description.length) {
        setDisplayedText((prev) => prev + description[index]);
        index++;
      } else {
        clearInterval(typingInterval); // Stop the interval when done
      }
    }, 20);
    return () => clearInterval(typingInterval); // Cleanup on unmount
  }, []);

  return (
    <View className="flex-1 bg-black flex-col justify-between">
      {/* background */}
      <ImageBackground
        style={{ height: "100%" }}
        source={require("../../assets/welcomeBg.png")}
        resizeMode="cover"
        className="flex flex-col justify-between"
      >
        <View className="opacity-0">
          <Text>demo</Text>
        </View>
        <View className="translate-y-48 mx-3">
          <Text
            style={{
              fontSize: 32,
            }}
            className="text-white  font-semibold"
          >
            Smart AI Talks
          </Text>
          <Text
            style={{
              fontSize: 32,
            }}
            className="text-white my-6 ml-10 font-semibold"
          >
            Captivating Stories.
          </Text>
          <Text
            style={{
              fontSize: 32,
            }}
            className="text-white  font-semibold"
          >
            Words That Stick.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SignIn");
          }}
          style={{
            backgroundColor: "#FA541C",
          }}
          className="  mb-20 rounded-lg flex justify-center items-center py-3 mx-3"
        >
          <Text
            style={{
              fontSize: 15,
            }}
            className="text-white font-semibold "
          >
            Start the journey
          </Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  outlinedText: {
    color: "black",
    textShadowColor: "white",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});

export default LoginWelcomeScreen;
