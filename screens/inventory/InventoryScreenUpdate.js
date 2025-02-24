import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { ChevronLeft, Search } from "lucide-react-native";
import { TextInput } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InventoryScreenUpdate = ({ navigation, route }) => {
  const initialTab = route.params.initialTab;
  const translateX = useSharedValue(0);
  const translateBarX = useSharedValue(0);
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [ifInputFocus, setIfInputFocus] = useState(false);
  const [ifSearch, setIfSearch] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputWidthValue = useSharedValue(40);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateBarX.value }],
  }));

  const handlePageChange = (menu) => {
    if (!menu) return;
    if (menu === "word") {
      translateX.value = withTiming(0);
      translateBarX.value = withTiming(0);
    } else {
      translateX.value = withTiming(-SCREEN_WIDTH);
      translateBarX.value = withTiming(78);
    }
    setCurrentTab(menu);
  };

  useEffect(() => {
    handlePageChange(initialTab);
  }, []);

  const onGestureEvent = (event) => {
    const { translationX } = event.nativeEvent;
    translateX.value =
      translationX - (currentTab === "story" ? SCREEN_WIDTH : 0);
  };

  const onGestureEnd = (event) => {
    const { translationX, velocityX } = event.nativeEvent;
    if (translationX < -100 || velocityX < -500) {
      handlePageChange("story");
    } else if (translationX > 50 || velocityX > 500) {
      handlePageChange("word");
    } else {
      handlePageChange(currentTab);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-black h-full w-full pt-16 flex flex-col">
        <View
          style={{ height: 49 }}
          className="z-20 flex flex-row mb-2 items-center justify-between"
        >
          <TouchableOpacity
            style={{ width: 40 }}
            className="h-full flex justify-center items-center p-2"
            onPress={() => {
              if (!ifSearch) {
                navigation.goBack();
              } else {
                setIfSearch(false);
                setIfInputFocus(false);
                setInputVal("");
                inputWidthValue.value = 40;
              }
            }}
          >
            <ChevronLeft color={"#fff"} />
          </TouchableOpacity>

          {!ifSearch && (
            <View className="flex flex-row items-center">
              <Animated.View
                style={[
                  {
                    width: 24,
                    height: 2,
                    backgroundColor: "#fff",
                    borderRadius: 2,
                    opacity: 0.6,
                    left: 26,
                  },
                  animatedBarStyle,
                ]}
                className="absolute left-0 bottom-0"
              />
              <TouchableOpacity
                style={{ width: 78, height: 45 }}
                className="justify-center items-center"
                onPress={() => handlePageChange("word")}
              >
                <Text className="text-white font-medium text-lg text-opacity-60">
                  Word
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 78, height: 45 }}
                className="justify-center items-center"
                onPress={() => handlePageChange("story")}
              >
                <Text className="text-white font-medium text-lg text-opacity-60">
                  Story
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onEnded={onGestureEnd}
        >
          <Animated.View
            className="flex-1 overflow-hidden flex-row"
            style={[{ width: 2 * SCREEN_WIDTH }, animatedStyle]}
          >
            <View className="h-full bg-red-500" style={{ width: SCREEN_WIDTH }}>
              <Text>wordslist</Text>
            </View>
            <View
              className="h-full bg-green-500"
              style={{ width: SCREEN_WIDTH }}
            >
              <Text>storyList</Text>
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InventoryScreenUpdate;
