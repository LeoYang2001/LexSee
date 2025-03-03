import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";

const PronunciationButton = ({ word, phonetics, size = 16 }) => {
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (phonetics?.audioUrl) {
      setAudioUrl(phonetics?.audioUrl);
    } else {
    }
  }, []);

  const playSound = async () => {
    if (!audioUrl) return alert("Resave this word to get pronunciation!");
    try {
      console.log("Loading Sound");
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });

      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.log("Cannot play sound", error);
    }
  };

  return (
    <TouchableOpacity
      onPress={playSound}
      className="py-1 flex flex-row items-center"
    >
      <Text
        style={{
          color: "#FFFFFFB3",
          fontSize: size,
        }}
      >
        {phonetics.text}
      </Text>
      <Volume2 className="ml-2" color={"#FFFFFFB3"} size={size} />
    </TouchableOpacity>
  );
};

export default PronunciationButton;
