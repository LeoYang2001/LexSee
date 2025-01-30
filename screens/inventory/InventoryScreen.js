import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import React, { useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import StoryListPage from "./StoryList/StoryListPage";
import WordListPage from "./WordList/WordListPage";
import { ChevronLeft, Search } from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const InventoryScreen = ({ navigation }) => {
  const translateX = useSharedValue(0); // Shared value for horizontal translation
  const translateBarX = useSharedValue(0); // Shared value for horizontal translation

  // Animated styles for sliding the pages
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const animatedBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateBarX.value }],
  }));

  // Handle page change on pagination header click
  const handlePageChange = (menu) => {
    if (menu === "word") {
      translateX.value = withTiming(0); // Animate to the clicked page
      translateBarX.value = withTiming(0); // Animate to the clicked page
    } else {
      // Animate to the clicked page
      translateX.value = withTiming(-1 * SCREEN_WIDTH);
      translateBarX.value = withTiming(78);
    }
  };

  //Story Creation related data
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);

  return (
    <View className="bg-black  overflow-hidden  h-full w-full pt-16 flex flex-col ">
      {/* HEADER  */}
      <View className="z-20 flex flex-row   items-center justify-between">
        <TouchableOpacity
          className=" p-2"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
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
        <TouchableOpacity className=" p-2">
          <Search color={"#fff"} />
        </TouchableOpacity>
      </View>

      {/* Pages */}
      <Animated.View
        className=" flex-1   overflow-hidden flex-row "
        style={[{ width: 2 * SCREEN_WIDTH }, animatedStyle]}
      >
        <View className="h-full" style={{ width: SCREEN_WIDTH }}>
          <WordListPage
            setIsGeneratingStory={setIsGeneratingStory}
            navigation={navigation}
            handlePageChange={handlePageChange}
          />
        </View>
        <View className="h-full " style={{ width: SCREEN_WIDTH }}>
          <StoryListPage isGeneratingStory={isGeneratingStory} />
        </View>
      </Animated.View>
    </View>
  );
};

export default InventoryScreen;
