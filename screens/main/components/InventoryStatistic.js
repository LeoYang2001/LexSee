import { View, Text, ImageBackground } from "react-native";
import React from "react";

const InventoryStatistic = () => {
  const mockData = {
    rank: "Beginner",
    todayCount: 0,
    total: 16,
  };

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
        <View className=" flex flex-col h-full gap-2  flex-1 justify-center items-start">
          <Text style={{ fontSize: 24 }} className=" font-semibold text-white">
            {mockData.rank}
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
        <View className=" flex flex-col h-full gap-2   flex-1 justify-center items-center">
          <Text style={{ fontSize: 24 }} className=" font-semibold text-white">
            {mockData.todayCount}
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            className="text-white"
          >
            Today
          </Text>
        </View>
        <View className=" flex flex-col h-full gap-2   flex-1 justify-center items-end">
          <Text style={{ fontSize: 24 }} className=" font-semibold text-white">
            {mockData.total}
          </Text>
          <Text
            style={{
              fontSize: 12,
              opacity: 0.8,
            }}
            className="text-white"
          >
            total
          </Text>
        </View>
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
