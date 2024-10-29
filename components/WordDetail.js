import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useState } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { Audio } from "expo-av";
import { ScrollView } from "react-native-gesture-handler";
import Page2 from "./Page2";
import Page1 from "./Page1";

const { width: SCREEN_WIDTH, height: screenHeight } = Dimensions.get("window");

const WordDetail = ({
  wordItem,
  bottomSheetModalRef,
  bottomSheetViewMode,
  setBottomSheetViewMode,
}) => {
  const [activePage, setActivePage] = useState(0); // Keep track of the active page (0: Page1, 1: Page2)
  const translateX = useSharedValue(0); // Shared value for horizontal translation

  // Handle page change on pagination header click
  const handlePageChange = (page) => {
    if (page !== activePage) {
      translateX.value = withTiming(-page * SCREEN_WIDTH); // Animate to the clicked page
      setActivePage(page);
    }
  };

  // Animated styles for sliding the pages
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!wordItem) return;
  if (bottomSheetViewMode === "small")
    return (
      <View className="w-full z-20 h-full py-6  px-10">
        <>
          <View>
            <View className="flex-row  items-center ">
              <Text className="text-white font-semibold text-2xl">
                {wordItem.id}
              </Text>
              {wordItem?.phonetics && (
                <Text className="text-gray-400 text-sm ml-3">
                  {wordItem?.phonetics?.text}
                </Text>
              )}
            </View>
          </View>
          <Image
            source={{ uri: wordItem.imgUrl }}
            style={{
              width: "100%",
              height: 180,
              borderRadius: 8,
              marginTop: 10,
            }} // Adjust height as needed
            resizeMode="cover" // Adjust to 'contain' if you want the image to fit inside the box
          />
          <View className="flex-row border mt-auto  justify-center ">
            {/* <ListenButton audioUrl={wordItem?.phonetics?.audio} /> */}
            <TouchableOpacity
              onPress={() => {
                setBottomSheetViewMode("loading");
                bottomSheetModalRef.current.snapToIndex(2);
              }}
              className="rounded-xl bg-white p-3 mb-6"
            >
              <Text className="text-black font-semibold">View more</Text>
            </TouchableOpacity>
          </View>
        </>
      </View>
    );
  else if (bottomSheetViewMode === "loading")
    return (
      <View
        style={{
          height: screenHeight,
        }}
        className=" bg-black w-full flex justify-center items-center "
      >
        <ActivityIndicator color={"white"} />
      </View>
    );
  else
    return (
      <View
        style={{ height: screenHeight, borderRadius: 47 }}
        className="w-full relative  overflow-hidden"
      >
        {/* Pagination Header */}
        <View className="mt-14 absolute w-full z-20 flex flex-row  justify-center">
          <TouchableOpacity
            onPress={() => {
              if (activePage === 0) {
                handlePageChange(1);
              } else {
                handlePageChange(0);
              }
            }}
            style={{
              backgroundColor: "rgba(146, 147, 148, 0.4)",
            }}
            className="p-2 px-4 flex flex-row shadow-lg   rounded-2xl "
          >
            <View
              className="mr-2"
              style={{
                width: 6,
                height: 6,
                borderRadius: 6,
                backgroundColor: activePage === 0 ? "white" : "gray",
              }}
            />
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 6,
                backgroundColor: activePage === 1 ? "white" : "gray",
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Pages */}
        <Animated.View
          className="absolute  h-full overflow-hidden flex-row "
          style={[{ borderRadius: 47, width: 2 * SCREEN_WIDTH }, animatedStyle]}
        >
          <View style={{ width: SCREEN_WIDTH }}>
            <Page1 wordItem={wordItem} handlePageChange={handlePageChange} />
          </View>
          <View style={{ width: SCREEN_WIDTH }}>
            <Page2 wordItem={wordItem} handlePageChange={handlePageChange} />
          </View>
        </Animated.View>
      </View>
    );
};

export default WordDetail;
