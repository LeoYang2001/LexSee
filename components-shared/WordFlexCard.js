import { View, Text, TouchableOpacity, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { ArrowRight, Volume2 } from "lucide-react-native";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";

const WordFlexCard = ({ wordItem, ifActive, setActiveCardId, navigation }) => {
  if (!wordItem) return null;

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
    <Pressable
      style={{
        width: "100%",
        borderRadius: 12,
      }}
      className="w-full flex flex-col relative mb-4"
      onPress={() => {
        if (!ifActive) {
          setActiveCardId(wordItem.id);
        } else {
          setActiveCardId(null);
        }
      }}
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
                console.log(navigation);
                navigation.navigate("Definition");
              }}
              className="p-1"
            >
              <ArrowRight color={"#fff"} />
            </TouchableOpacity>
          </View>
          <View className="flex flex-row">
            <TouchableOpacity className="py-1 flex flex-row">
              <Text
                style={{
                  color: "#FFFFFFB3",
                }}
              >
                {wordItem.phonetics.text}
              </Text>
              <Volume2 className="ml-2" color={"#FFFFFFB3"} size={16} />
            </TouchableOpacity>
          </View>

          {ifActive && (
            <View className="w-full flex flex-row mt-auto">
              <View
                style={{
                  height: 20,
                  backgroundColor: "#222833",
                  borderRadius: 2,
                }}
                className="flex px-1 justify-center border items-center mr-2"
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
            <BlurView className="w-full flex-1 py-2 px-3 mt-2" intensity={40}>
              <Text
                style={{
                  color: "#fff",
                  opacity: 0.7,
                  borderRadius: 10,
                }}
              >
                {wordItem.meanings[0].definitions}
              </Text>
            </BlurView>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default WordFlexCard;
