import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
    <View className="flex-1 bg-black px-6 flex-col justify-between">
      <View></View>
      <View>
        <View>
          <Text className="text-white font-bold text-4xl">YOUR</Text>
          <Animated.View
            style={{
              left: offSetLeft,
            }}
          >
            <Text
              style={styles.outlinedText}
              className="text-4xl font-bold text-black"
            >
              LexSee
            </Text>
          </Animated.View>
          <Text className="text-white font-bold text-4xl">VOCABULARY</Text>
        </View>
        <View>
          <Text
            style={{ fontFamily: "Helvetica Neue" }}
            className="text-white font-semithin mt-10"
          >
            {displayedText}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate("SignIn");
        }}
        className="bg-white rounded-lg flex justify-center items-center py-3 mb-14 "
      >
        <Text className="text-black font-semibold text-lg">Start</Text>
      </TouchableOpacity>
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
