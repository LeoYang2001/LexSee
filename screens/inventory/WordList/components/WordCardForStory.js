import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Volume2 } from "lucide-react-native";
import PronunciationButton from "../../../../components-shared/PronunciationButton";
import WordFlexCardInventoryForStory from "./WordFlexCardInventoryForStory";

const WordCardForStory = ({
  wordItem,
  ifGraphic,
  navigation,
  toggleWordSelection,
}) => {
  if (ifGraphic)
    return (
      <WordFlexCardInventoryForStory
        toggleWordSelection={toggleWordSelection}
        wordItem={wordItem}
        navigation={navigation}
      />
    );
  else
    return (
      <TouchableOpacity
        onPress={() => {
          toggleWordSelection(wordItem.id);
        }}
      >
        <LinearGradient
          colors={["#23272F", "#242424"]}
          style={{ height: 79, borderRadius: 8 }}
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

export default WordCardForStory;
