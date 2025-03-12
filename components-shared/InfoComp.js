import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Info } from "lucide-react-native";

const InfoComp = ({ timeDur, infoMessage, setInfoMessage }) => {
  const translateY = useSharedValue(-200); // Initial value

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    };
  });

  useEffect(() => {
    if (infoMessage === "") {
      return;
    }
    translateY.value = withTiming(0, {
      // Target value for showing the info
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    const timer = setTimeout(() => {
      translateY.value = withTiming(-200, {
        // Target value for hiding the info
        duration: 500,
        easing: Easing.in(Easing.ease),
      });
      setTimeout(() => {
        setInfoMessage("");
      }, 500);
    }, timeDur); // Adjust the delay to account for the easing out duration

    return () => clearTimeout(timer);
  }, [timeDur, infoMessage, translateY]);

  return (
    <Animated.View
      style={[animatedStyle]}
      className="bg-black flex w-full rounded p-4 flex-row justify-between items-center"
    >
      <Info fill={"black"} color={"white"} size={25} />
      <Text className="text-white text-lg text-center font-medium">
        {infoMessage}
      </Text>
      <View className=" w-2 h-2" />
    </Animated.View>
  );
};

export default InfoComp;
