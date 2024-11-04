import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { TriangleAlert } from "lucide-react-native";

const AlertComp = ({ timeDur, alertMessage, setAlertMessage }) => {
  const alertMessageOpacity = useSharedValue(0);

  useEffect(() => {
    if (alertMessage) {
      // Fade in with ease-in-out easing
      alertMessageOpacity.value = withTiming(1, {
        duration: timeDur,
      });

      // Fade out smoothly after 2 seconds
      setTimeout(() => {
        alertMessageOpacity.value = withTiming(0, {
          duration: timeDur,
        });
        // Clear message after fade-out animation completes
        setTimeout(() => {
          setAlertMessage("");
        }, timeDur); // Delay clear to match fade-out duration
      }, timeDur * 3);
    }
  }, [alertMessage]);

  if (!alertMessage) return;

  return (
    <Animated.View
      style={{
        opacity: alertMessageOpacity,
        transition: { duration: 300 },
      }}
      className="bg-yellow-200 flex w-full rounded-lg p-4 mt-4 flex-row justify-between items-center"
    >
      <TriangleAlert fill={"#ca8a04"} color={"#fef08a"} size={30} />
      <Text className="text-yellow-700 text-lg text-center font-medium">
        {alertMessage}
      </Text>
      <View className=" w-2 h-2" />
    </Animated.View>
  );
};

export default AlertComp;
