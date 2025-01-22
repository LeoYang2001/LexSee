import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Volume2 } from "lucide-react-native";
import * as Speech from "expo-speech";

const PronunciationButton = ({ word, phonetics, size = 16 }) => {
  const speak = () => {
    const thingToSay = word;
    Speech.speak(thingToSay);
  };

  console.log(word);
  return (
    <TouchableOpacity
      onPress={speak}
      className="py-1 flex flex-row items-center"
    >
      <Text
        style={{
          color: "#FFFFFFB3",
          fontSize: size,
        }}
      >
        {phonetics}
      </Text>
      <Volume2 className="ml-2" color={"#FFFFFFB3"} size={size} />
    </TouchableOpacity>
  );
};

export default PronunciationButton;
