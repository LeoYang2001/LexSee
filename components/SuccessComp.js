import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { CircleCheck } from "lucide-react-native";

const SuccessComp = ({ timeDur, successMessage, setSuccessMessage }) => {
  const successMessageOpacity = useSharedValue(0);

  useEffect(() => {
    if (successMessage) {
      // Fade in with ease-in-out easing
      successMessageOpacity.value = withTiming(1, {
        duration: timeDur,
      });

      // Fade out smoothly after 2 seconds
      setTimeout(() => {
        successMessageOpacity.value = withTiming(0, {
          duration: timeDur,
        });
        // Clear message after fade-out animation completes
        setTimeout(() => {
          setSuccessMessage("");
        }, timeDur); // Delay clear to match fade-out duration
      }, timeDur * 3);
    }
  }, [successMessage]);

  if (!successMessage) return;

  return (
    <Animated.View
      style={{
        opacity: successMessageOpacity,
        transition: { duration: 300 },
      }}
      className="bg-green-200 flex w-full rounded-lg p-4 mt-4 flex-row justify-between items-center"
    >
      <CircleCheck fill={"#22c55e"} color={"#bbf7d0"} size={30} />
      <Text className="text-green-700 text-lg text-center font-medium">
        {successMessage}
      </Text>
      <View className=" w-2 h-2" />
    </Animated.View>
  );
};

export default SuccessComp;
