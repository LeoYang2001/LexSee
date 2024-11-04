import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Info } from "lucide-react-native";

const InfoComp = ({ timeDur, infoMessage, setInfoMessage }) => {
  const infoMessageOpacity = useSharedValue(0);

  useEffect(() => {
    if (infoMessage) {
      // Fade in with ease-in-out easing
      infoMessageOpacity.value = withTiming(1, {
        duration: timeDur,
      });

      // Fade out smoothly after 2 seconds
      setTimeout(() => {
        infoMessageOpacity.value = withTiming(0, {
          duration: timeDur,
        });
        // Clear message after fade-out animation completes
        setTimeout(() => {
          setInfoMessage("");
        }, timeDur); // Delay clear to match fade-out duration
      }, timeDur * 3);
    }
  }, [infoMessage]);

  if (!infoMessage) return;

  return (
    <Animated.View
      style={{
        opacity: infoMessageOpacity,
        transition: { duration: 300 },
      }}
      className="bg-blue-200 flex w-full rounded-lg p-4 mt-4 flex-row justify-between items-center"
    >
      <Info fill={"#3b82f6"} color={"#bfdbfe"} size={30} />
      <Text className="text-blue-700 text-lg text-center font-medium">
        {infoMessage}
      </Text>
      <View className=" w-2 h-2" />
    </Animated.View>
  );
};

export default InfoComp;
