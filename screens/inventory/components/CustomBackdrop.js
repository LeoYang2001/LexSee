import React, { useMemo } from "react";
import * as Haptics from "expo-haptics";

import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { Pressable } from "react-native";

const CustomBackdrop = ({ animatedIndex, style, bottomSheetRef }) => {
  // Animated opacity based on the BottomSheet's position
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      animatedIndex.value,
      [0, 1], // As the sheet moves from index 0 to 1
      [0, 1], // The opacity will animate from 0 (transparent) to 1 (opaque)
      Extrapolate.CLAMP
    ),
  }));

  // Combining styles
  const containerStyle = useMemo(
    () => [
      style,
      {
        backgroundColor: "rgba(0,0,0,0.4)", // Custom color for the backdrop
      },
      containerAnimatedStyle, // Apply animated style for opacity
    ],
    [style, containerAnimatedStyle]
  );

  return (
    <Animated.View style={containerStyle}>
      <Pressable
        onPress={() => {
          bottomSheetRef?.current.close();
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }}
        className=" w-full h-full"
      />
    </Animated.View>
  );
};

export default CustomBackdrop;
