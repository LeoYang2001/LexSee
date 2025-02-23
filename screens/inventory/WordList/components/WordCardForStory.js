import React from "react";
import { View, Text, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import WordFlexCardInventoryForStory from "./WordFlexCardInventoryForStory";
import * as Haptics from "expo-haptics";
import WordCardWithoutImageForStory from "./WordCardWithoutImageForStory";

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
      <WordCardWithoutImageForStory
        toggleWordSelection={toggleWordSelection}
        wordItem={wordItem}
        navigation={navigation}
      />
    );
};

export default WordCardForStory;
