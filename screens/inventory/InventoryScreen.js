import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import StoryListPage from "./StoryList/StoryListPage";
import WordListPage from "./WordList/WordListPage";
import { ChevronLeft, Search } from "lucide-react-native";
import { useSelector } from "react-redux";

const { width: SCREEN_WIDTH, height: screenHeight } = Dimensions.get("window");

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

  const savedWordList = useSelector((state) => {
    try {
      return JSON.parse(state.userInfo.savedWordList); // Parse the stringified word list
    } catch (error) {
      console.log("Error parsing savedWordList:", error);
      return [];
    }
  });


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

  return (
    <View className="bg-black  h-full w-full pt-16  ">
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
        className="h-full overflow-hidden flex-row "
        style={[{ width: 2 * SCREEN_WIDTH }, animatedStyle]}
      >
        <View style={{ width: SCREEN_WIDTH }}>
          <WordListPage />
        </View>
        <View style={{ width: SCREEN_WIDTH }}>
          <StoryListPage />
        </View>
      </Animated.View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

export default InventoryScreen;
