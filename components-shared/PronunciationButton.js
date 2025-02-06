import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";

const pronunciationApiKey = "2319e40ba1cbae8dc8a250c59df43868";

const PronunciationButton = ({ word, phonetics, size = 16 }) => {
  const languageCode = "en";
  const pronunciationApiPoint = `https://apifree.forvo.com/key/${pronunciationApiKey}/format/json/order/date-desc/action/word-pronunciations/word/${word}/language/${languageCode}`;

  const [audioUrl, setAudioUrl] = useState(null);

  const fetchPronunciation = async () => {
    try {
      const response = await fetch(pronunciationApiPoint);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        // Get the most recent pronunciation
        const audioUrl = data.items[0].pathmp3;
        // Play the audio
        setAudioUrl(audioUrl);
        return audioUrl;
      } else {
        console.log("No pronunciation found");
      }
    } catch (error) {
      console.error("Error fetching pronunciation:", error);
      console.log("Error", "Failed to load pronunciation");
    }
  };

  const playSound = async () => {
    await fetchPronunciation();
    if (!audioUrl) return alert("fetching audio, please wait");
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
        {phonetics}
      </Text>
      <Volume2 className="ml-2" color={"#FFFFFFB3"} size={size} />
    </TouchableOpacity>
  );
};

export default PronunciationButton;
