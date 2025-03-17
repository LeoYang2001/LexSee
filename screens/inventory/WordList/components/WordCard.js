import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Volume2 } from "lucide-react-native";
import PronunciationButton from "../../../../components-shared/PronunciationButton";
import WordFlexCardInventory from "./WordFlexCardInventory";

const WordCard = ({ wordItem, ifGraphic, navigation, activeCardId }) => {
  if (ifGraphic)
    return (
      <WordFlexCardInventory
        activeCardId={activeCardId}
        wordItem={wordItem}
        navigation={navigation}
      />
    );
  else
    return (
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
            <PronunciationButton
              word={wordItem.id}
              phonetics={wordItem.phonetics}
              size={14}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Definition", {
                wordItem: JSON.stringify(wordItem),
                ifSaved: true,
              });
            }}
          >
            <ArrowRight color="white" opacity={0.8} size={22} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
};

export default WordCard;
