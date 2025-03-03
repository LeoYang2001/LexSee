import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { Volume2 } from "lucide-react-native";
import { Audio } from "expo-av";

const PronunciationButton = ({ word, phonetics, size = 16 }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (phonetics?.audioUrl) {
      setAudioUrl(phonetics?.audioUrl);
    } else {
    }
  }, []);

  const fetchAudioUrl = async (text) => {
    const apiUrl =
      "https://converttexttospeech-lcwrfk4hzq-uc.a.run.app/convert-text-to-speech";

    // Prepare the request payload
    const requestData = {
      text: text,
    };

    try {
      // Send POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(requestData), // Convert the data to JSON
      });

      // Check if the response is OK (status 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        return data.audioUrl; // Return the audio URL
      } else {
        console.error(
          "Failed to fetch audio URL:",
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

  const playSound = async () => {
    if (!audioUrl) {
      try {
        const fetchedAudioUrl = await fetchAudioUrl(word);
        console.log("audio fetched successfully");
        setAudioUrl(fetchedAudioUrl);
        Alert.alert(
          "audio fetched successfully, recollect this word to save the audio"
        );
      } catch (error) {
        console.error("Error fetching audio URL:", error);
        Alert.alert("Error fetching audio");
      }
    }
    if (isPlaying) return; // Prevent multiple taps
    try {
      console.log("Loading Sound");
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true, // Ensures audio plays in silent mode
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        shouldDuckAndroid: false,
      });

      setIsPlaying(true);
      const { sound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false);
          console.log("finished playing sound");
        }
      });
      console.log("Playing Sound");
      await sound.playAsync();
    } catch (error) {
      console.log("Cannot play sound", error);
      setIsPlaying(false);
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
