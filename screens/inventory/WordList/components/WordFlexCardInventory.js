import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import PronunciationButton from "../../../../components-shared/PronunciationButton";
import { BlurView } from "expo-blur";

const WordFlexCardInventory = ({ wordItem, navigation, activeCardId }) => {
  if (!wordItem) return null;

  const ifActive = activeCardId === wordItem.id;

  // Reanimated value to control the height of the card
  const cardHeight = useSharedValue(132);

  // Update card height based on the `ifActive` prop
  useEffect(() => {
    cardHeight.value = ifActive ? 207 : 132;
  }, [ifActive]);

  // Animated style for the height transition
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: withSpring(cardHeight.value, { damping: 20, stiffness: 200 }),
    };
  });

  return (
    <Animated.View className=" mb-4" style={[{ width: "100%" }, animatedStyle]}>
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

        {ifActive && (
          <View className="w-full flex flex-row mt-auto">
            <View
              style={{
                height: 20,
                backgroundColor: "#222833",
                borderRadius: 2,
              }}
              className="flex px-1 justify-center items-center mr-2"
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                }}
              >
                {wordItem?.meanings[0]?.partOfSpeech}
              </Text>
            </View>
          </View>
        )}
        {ifActive && (
          <View
            style={{
              borderRadius: 10,
            }}
            className="w-full flex-1  overflow-hidden mt-2"
          >
            <BlurView className="w-full h-full  py-2 px-3" intensity={40}>
              <Text
                style={{
                  color: "#fff",
                  opacity: 0.7,
                }}
              >
                {wordItem.meanings[0]?.definition ||
                  wordItem.meanings[0]?.definitions[0]?.definition}
              </Text>
            </BlurView>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

export default WordFlexCardInventory;
