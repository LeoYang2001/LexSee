import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import PronunciationButton from "../../../../components-shared/PronunciationButton";

const WordCardWithoutImageForStory = ({ wordItem, toggleWordSelection }) => {
  if (!wordItem) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        toggleWordSelection(wordItem.id);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("light feedback");
      }}
    >
      <LinearGradient
        colors={["#23272f", "#242424"]}
        style={{ height: 79, borderRadius: 12 }}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="mb-4"
      >
        <View className="flex flex-row justify-between items-center h-full px-4 py-3">
          <View className="h-full flex flex-col justify-between">
            <Text
              style={{ opacity: 0.8, fontSize: 20 }}
              className="text-white font-semibold"
            >
              {wordItem.id}
            </Text>
            <PronunciationButton
              word={wordItem.id}
              phonetics={wordItem.phonetics}
              size={14}
            />
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
