import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import PronunciationButton from "../../../components-shared/PronunciationButton";

const WordFlexCardInventory = ({ wordItem, navigation }) => {
  if (!wordItem) return null;

  // Reanimated value to control the height of the card
  const cardHeight = useSharedValue(132);

  // Animated style for the height transition
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(cardHeight.value, { damping: 20, stiffness: 200 }),
    };
  });

  return (
    <View
      style={{
        width: "100%",
        borderRadius: 12,
      }}
      className="w-full flex flex-col relative mb-4"
    >
      <Animated.View style={[{ width: "100%" }, animatedStyle]}>
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
        <View className="w-full h-full p-4 absolute z-20 flex flex-col">
          <View className="flex flex-row justify-between">
            <Text className="font-semibold text-white" style={{ fontSize: 24 }}>
              {wordItem.id}
            </Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Definition", {
                  wordItem: JSON.stringify(wordItem),
                  ifSaved: true,
                });
              }}
              className="p-1"
            >
              <ArrowRight color={"#fff"} />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row">
            <PronunciationButton
              word={wordItem.id}
              phonetics={wordItem?.phonetics?.text}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WordFlexCardInventory;
