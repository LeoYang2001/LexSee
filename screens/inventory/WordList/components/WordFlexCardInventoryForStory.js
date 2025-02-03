import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react-native";

const WordFlexCardInventoryForStory = ({ wordItem, toggleWordSelection }) => {
  if (!wordItem) return null;

  return (
    <TouchableOpacity
      onPress={() => {
        toggleWordSelection(wordItem.id);
      }}
      style={{
        width: "100%",
        borderRadius: 12,
      }}
      className="w-full flex flex-col relative mb-4"
    >
      <View style={[{ width: "100%", height: 132 }]}>
        <Image
          className="absolute"
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 12,
          }}
          source={{
            uri: wordItem.imgUrl,
          }}
          resizeMode="cover"
        />
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.4)",
            borderRadius: 12,
          }}
          className="w-full h-full"
        ></View>
        <View className="w-full h-full p-4 absolute z-20  justify-between items-center flex flex-row">
          <View className="flex flex-col  h-full">
            <Text className="font-semibold text-white" style={{ fontSize: 24 }}>
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
      </View>
    </TouchableOpacity>
  );
};

export default WordFlexCardInventoryForStory;
