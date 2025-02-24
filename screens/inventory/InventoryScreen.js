import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import StoryListPage from "./StoryList/StoryListPage";
import WordListPage from "./WordList/WordListPage";
import { ChevronLeft, Search } from "lucide-react-native";
import { PanGestureHandler, TextInput } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InventoryScreen = ({ navigation, route }) => {
  const initialTab = route.params.initialTab;

  const translateX = useSharedValue(0); // Shared value for horizontal translation
  const translateBarX = useSharedValue(0); // Shared value for horizontal translation

  // Animated styles for sliding the pages
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  //State to control tab
  const [currentTab, setCurrentTab] = useState(initialTab);
  const [ifInputFocus, setIfInputFocus] = useState(false);
  const [ifSearch, setIfSearch] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const inputWidthValue = useSharedValue(40); // Start with 40px width

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    width: withTiming(inputWidthValue.value, { duration: 300 }), // Smooth animation
  }));
  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateBarX.value }],
  }));

  const resetInputSearchBar = () => {
    setIfInputFocus(false);
    setIfSearch(false);
    setInputVal("");
    inputWidthValue.value = 40;
  };

  // Handle page change on pagination header click
  const handlePageChange = (menu) => {
    if (!menu) return;
    if (menu === "word") {
      translateX.value = withTiming(0); // Animate to the clicked page
      translateBarX.value = withTiming(0); // Animate to the clicked page
    } else {
      // Animate to the clicked page
      translateX.value = withTiming(-1 * SCREEN_WIDTH);
      translateBarX.value = withTiming(78);
    }
    setCurrentTab(menu);
  };

  useEffect(() => {
    handlePageChange(initialTab);
  }, []);

  const onGestureEvent = (event) => {
    if (ifSearch) return;
    const { translationX } = event.nativeEvent;
    translateX.value =
      translationX - (currentTab === "story" ? SCREEN_WIDTH : 0);
  };

  const onGestureEnd = (event) => {
    if (ifSearch) return;

    const { translationX, velocityX } = event.nativeEvent;
    if (translationX < -100 || velocityX < -500) {
      handlePageChange("story");
    } else if (translationX > 50 || velocityX > 500) {
      handlePageChange("word");
    } else {
      handlePageChange(currentTab);
    }
  };

  //Story Creation related data
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View className="bg-black  overflow-hidden  h-full w-full pt-16 flex flex-col ">
        {/* HEADER  */}
        <View
          style={{ height: 49 }}
          className="z-20 flex flex-row   mb-2  items-center justify-between"
        >
          <TouchableOpacity
            style={{
              width: 40,
            }}
            className=" h-full flex justify-center items-center p-2"
            onPress={() => {
              if (!ifSearch) {
                navigation.goBack();
              } else {
                resetInputSearchBar();
              }
            }}
          >
            <ChevronLeft color={"#fff"} />
          </TouchableOpacity>
          {!ifSearch && (
            <View className="flex flex-row items-center  ">
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
                onPress={() => {
                  handlePageChange("word");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("light feedback");
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    opacity: 0.6,
                  }}
                  className="text-white font-medium text-lg text-opacity-60"
                >
                  Word
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 78, height: 45 }}
                className="justify-center items-center"
                onPress={() => {
                  handlePageChange("story");
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("light feedback");
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    opacity: 0.6,
                  }}
                  className="text-white font-medium text-lg text-opacity-60"
                >
                  Story
                </Text>
              </TouchableOpacity>
            </View>
          )}
          <Animated.View
            style={[
              {
                marginRight: ifSearch ? 5 : 0,
              },
              inputAnimatedStyle,
            ]}
          >
            {currentTab === "word" && (
              <TouchableOpacity
                disabled={ifSearch}
                onPress={() => {
                  setIfSearch(true);
                  inputWidthValue.value = SCREEN_WIDTH - 50;
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  console.log("light feedback");
                }}
                style={{
                  backgroundColor: ifSearch ? "#1f2022" : "transparent",
                  width: "100%",
                  borderRadius: 12,
                }}
                className=" flex  h-full flex-row justify-start items-center relative bg-gray-500 px-3"
              >
                {!ifInputFocus && !inputVal && (
                  <Search size={22} opacity={0.6} color={"#fff"} />
                )}
                {ifSearch && (
                  <TextInput
                    value={inputVal}
                    onChangeText={setInputVal}
                    onBlur={() => {
                      setIfInputFocus(false);
                    }}
                    onFocus={() => {
                      setIfInputFocus(true);
                    }}
                    className=" absolute w-full h-full  mx-2  ml-3 text-white"
                  />
                )}
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onEnded={onGestureEnd}
        >
          {/* Pages */}
          <Animated.View
            className=" flex-1   overflow-hidden flex-row "
            style={[{ width: 2 * SCREEN_WIDTH }, animatedStyle]}
          >
            <View className="h-full" style={{ width: SCREEN_WIDTH }}>
              <WordListPage
                ifSearch={ifSearch}
                inputVal={inputVal}
                setIsGeneratingStory={setIsGeneratingStory}
                navigation={navigation}
                handlePageChange={handlePageChange}
              />
            </View>
            <View className="h-full " style={{ width: SCREEN_WIDTH }}>
              <StoryListPage
                navigation={navigation}
                isGeneratingStory={isGeneratingStory}
              />
            </View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default InventoryScreen;
