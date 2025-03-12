import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useAnimatedStyle,
} from "react-native-reanimated";
import { CircleCheck } from "lucide-react-native";

const SuccessComp = ({ timeDur, successMessage, setSuccessMessage }) => {
  const translateY = useSharedValue(-200); // Adjust initial value to move further down

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    };
  });

  useEffect(() => {
    if (successMessage === "") {
      return;
    }
    translateY.value = withTiming(0, {
      // Target value for showing the success
      duration: 500,
      easing: Easing.out(Easing.ease),
    });

    const timer = setTimeout(() => {
      translateY.value = withTiming(-200, {
        // Adjust target value for hiding the success
        duration: 500,
        easing: Easing.in(Easing.ease),
      });
      setTimeout(() => {
        setSuccessMessage("");
      }, 500);
    }, timeDur); // Adjust the delay to account for the easing out duration

    return () => clearTimeout(timer);
  }, [timeDur, successMessage, translateY]);

  return (
    <Animated.View
      style={[animatedStyle]}
      className="bg-black flex w-full rounded p-4 flex-row justify-between items-center"
    >
      <CircleCheck fill={"black"} color={"white"} size={25} />
      <Text className="text-white text-lg text-center font-medium">
        {successMessage}
      </Text>
      <View className=" w-2 h-2" />
    </Animated.View>
  );
};

export default SuccessComp;
