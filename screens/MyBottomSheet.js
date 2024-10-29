import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  StyleSheet,
  Dimensions,
  Pressable,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  runOnJS,
} from "react-native-reanimated";

const MyBottomSheet = forwardRef(
  (
    {
      bottomSheetConfig,
      screenComponent: ScreenComponent,
      bottomSheetComponent: BottomSheetComponent,
    },
    ref
  ) => {
    const {
      iniIndex,
      snapPoints,
      slideDuration,
      handleCurrentIndex,
      ifHideHandleBar,
      bottomSheetViewStyle,
    } = bottomSheetConfig;
    const screenHeight = Dimensions.get("window").height;
    const translateY = useSharedValue(0);
    const opacity = useSharedValue(0);

    const [currentSnapIndex, setCurrentSnapIndex] = useState(iniIndex);
    const [ifBottomSheet, setIfBottomSheet] = useState(true);
    const [ifHandleBar, setIfHandleBar] = useState(true);

    useEffect(() => {
      if (!ifHideHandleBar) return;
      if (currentSnapIndex === snapPoints.length - 1) {
        setIfHandleBar(false);
      } else {
        setIfHandleBar(true);
      }
    }, [ifHideHandleBar, currentSnapIndex]);

    // Expose snapTo function to the parent component
    useImperativeHandle(ref, () => ({
      snapTo,
    }));

    useEffect(() => {
      if (handleCurrentIndex) handleCurrentIndex(currentSnapIndex);
      setIfBottomSheet(currentSnapIndex !== 0);
    }, [currentSnapIndex]);

    const snapTo = (index) => {
      const snapToHeight = snapPoints[index] * screenHeight;

      translateY.value = withTiming(-1 * snapToHeight, {
        duration: slideDuration,
        easing: Easing.out(Easing.ease),
      });

      opacity.value =
        index === 0
          ? withTiming(0, { duration: slideDuration })
          : withTiming(1, { duration: slideDuration });

      setCurrentSnapIndex(index); // Update current snap index
    };

    useEffect(() => {
      snapTo(iniIndex);
    }, []);

    const gestureHandler = useAnimatedGestureHandler({
      onStart: (_, context) => {
        context.startY = translateY.value;
      },
      onActive: (event, context) => {
        translateY.value = context.startY + event.translationY;
      },
      onEnd: () => {
        const anchors = snapPoints.map((snap) => screenHeight * snap);

        const closestIndex = anchors.reduce(
          (closest, curr, index) => {
            return Math.abs(curr - Math.abs(translateY.value)) <
              Math.abs(anchors[closest] - Math.abs(translateY.value))
              ? index
              : closest;
          },
          0 // Start with the first index
        );

        runOnJS(snapTo)(closestIndex);
      },
    });

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateY: translateY.value }],
      };
    });

    const maskStyle = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
      };
    });

    return (
      <View style={{ height: screenHeight }} className="w-full absolute">
        <GestureHandlerRootView style={{ flex: 1 }} className="relative">
          {/* Render the passed screen component */}
          <View className=" w-full  flex-1">
            {ScreenComponent && <ScreenComponent />}
          </View>

          {/* MASK with animated opacity */}
          {ifBottomSheet && (
            <Animated.View
              style={[
                {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  height: screenHeight,
                  position: "absolute",
                  top: 0,
                  width: "100%",
                  zIndex: 9998,
                },
                maskStyle,
              ]}
            >
              <Pressable
                onPress={() => {
                  snapTo(0); // Close the sheet
                }}
                style={{
                  height: screenHeight,
                }}
              />
            </Animated.View>
          )}

          <PanGestureHandler onGestureEvent={gestureHandler}>
            <Animated.View
              style={[
                {
                  width: "100%",
                  height: screenHeight,
                  position: "absolute",
                  bottom: -screenHeight,
                  backgroundColor: "white",
                  borderRadius: 47,
                  zIndex: 9999,
                },
                bottomSheetViewStyle,
                animatedStyle,
              ]}
            >
              {/* HANDLE BAR  */}
              {ifHandleBar && (
                <View
                  style={{ height: 6 }}
                  className="w-10 bg-black my-3 self-center rounded-md"
                />
              )}
              <View
                style={{
                  height: ifHandleBar
                    ? screenHeight * snapPoints[currentSnapIndex] - 30
                    : screenHeight * snapPoints[currentSnapIndex],
                }}
                className="w-full"
              >
                {/* Sheet View content here */}
                <BottomSheetComponent />
              </View>
            </Animated.View>
          </PanGestureHandler>
        </GestureHandlerRootView>
      </View>
    );
  }
);

export default MyBottomSheet;
