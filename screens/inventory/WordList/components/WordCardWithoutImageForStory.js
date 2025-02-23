import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

const WordCardWithoutImageForStory = ({ wordItem, toggleWordSelection }) => {
  if (!wordItem) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        toggleWordSelection(wordItem.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("light feedback");
      }}
      className="w-full flex flex-col relative mb-4"
    >
      <LinearGradient
        colors={["#23272f", "#242424"]}
        style={{ height: 79, borderRadius: 12 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mb-4"
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 12,
          }}
          className="w-full h-full"
        ></View>
        <View className="w-full h-full p-4 absolute z-20  justify-between items-center flex flex-row">
          <View className="flex flex-col  h-full">
            <Text
              style={{ opacity: 0.8, fontSize: 20 }}
              className="text-white font-semibold"
            >
              {wordItem.id}
            </Text>
            <Text
              className="mt-2"
              style={{
                fontSize: 14,
                color: "#fff",
                opacity: 0.7,
              }}
            >
              {wordItem?.phonetics?.text}
            </Text>
          </View>
          {wordItem.ifSelectedForStory ? (
            <View
              className="rounded-full flex justify-center items-center"
              style={{
                width: 26,
                height: 26,
                backgroundColor: "#FA541C",
              }}
            >
              <Image
                source={require("../../../../assets/check.png")}
                width={20}
                height={20}
              />
            </View>
          ) : (
            <View
              className="rounded-full"
              style={{
                width: 26,
                height: 26,
                backgroundColor: "#fff",
                opacity: 0.6,
              }}
            ></View>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default WordCardWithoutImageForStory;
