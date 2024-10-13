import { View, Text } from "react-native";
import React, { useEffect } from "react";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

const ErrorComp = ({ errorMessage, setErrorMessage }) => {
  const errorMessageOpacity = useSharedValue(0);
  
  useEffect(() => {
    const timeDur = 500;
    if (errorMessage) {
      // Fade in
      errorMessageOpacity.value = withTiming(1, { duration: timeDur });

      // Fade out
      setTimeout(() => {
        errorMessageOpacity.value = withTiming(0, { duration: timeDur });
        setErrorMessage("");
      }, 2000);
    }
  }, [errorMessage]);

  if (!errorMessage) return;

  return (
    <Animated.View
      style={{
        opacity: errorMessageOpacity,
        transition: { duration: 300 },
      }}
      className="bg-red-600 rounded-2xl p-4 mt-4"
    >
      <Text className="text-white text-lg font-semibold text-center">
        {errorMessage}
      </Text>
    </Animated.View>
  );
};

export default ErrorComp;
