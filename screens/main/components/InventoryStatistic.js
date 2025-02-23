import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import React from "react";
import { useSelector } from "react-redux";
import * as Haptics from "expo-haptics";

const InventoryStatistic = ({ navigation }) => {
  const savedWordsFromStore = useSelector((state) => {
    try {
      return state.userInfo.savedWordList;
    } catch (error) {
      console.log("Error parsing savedWordList:", error);
      return [];
    }
  });

  const savedStoryList = useSelector((state) => state.userInfo.savedStoryList);

  return (
    <View
      style={{
        height: 120,
        backgroundColor: "#F65826",
        borderRadius: 12,
      }}
      className="w-full  relative"
    >
      <View className=" h-full w-full z-20 flex flex-row justify-between items-center  px-6">
        <View className=" flex flex-col h-full gap-2   flex-1 justify-center items-start">
          <Text
            style={{ fontSize: 22 }}
            className="   font-semibold text-white"
          >
            Beginner
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            className="text-white"
          >
            Rank
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Inventory", { initialTab: "word" });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log("light feedback");
          }}
          className=" flex flex-col h-full gap-2  ml-auto flex-1    justify-center items-center"
        >
          <Text style={{ fontSize: 24 }} className=" font-semibold text-white">
            {savedWordsFromStore.length}
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            className="text-white"
          >
            Word
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Inventory", { initialTab: "story" });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            console.log("light feedback");
          }}
          className=" flex flex-col h-full gap-2   flex-1 justify-center items-center"
        >
          <Text style={{ fontSize: 24 }} className=" font-semibold text-white">
            {savedStoryList.length}
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            className="text-white"
          >
            Story
          </Text>
        </TouchableOpacity>
      </View>
      <ImageBackground
        style={{ width: 140, height: 110 }}
        className=" absolute right-0"
        source={require("../../../assets/statisticLogo.png")} // Path to the logo image
        resizeMode="contain" // Ensures the aspect ratio is maintained
      ></ImageBackground>
    </View>
  );
};

export default InventoryStatistic;
