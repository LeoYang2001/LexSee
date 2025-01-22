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
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: screenHeight } = Dimensions.get("window");

const InventoryScreen = ({
  wordItem,
  bottomSheetModalRef,
  bottomSheetViewMode,
  setBottomSheetViewMode,
  navigation,
}) => {
  const [activePage, setActivePage] = useState(0); // Keep track of the active page (0: Page1, 1: Page2)
  const translateX = useSharedValue(0); // Shared value for horizontal translation
  const [selectedDefinition, setSelectedDefinition] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("word");

  // Handle page change on pagination header click
  const handlePageChange = (menu) => {
    if (menu === "word") {
      translateX.value = withTiming(0); // Animate to the clicked page
      setActivePage(menu);
    } else {
      translateX.value = withTiming(-1 * SCREEN_WIDTH); // Animate to the clicked page
      setActivePage("story");
    }
  };

  // Animated styles for sliding the pages
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleSelectingDef = (def) => {
    setSelectedDefinition(def);
    handlePageChange(1);
  };

  return (
    <SafeAreaView style={styles.container} className="bg-black">
      {/* Pagination Header */}
      <View className="z-20 flex flex-row justify-center">
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
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});

export default InventoryScreen;
