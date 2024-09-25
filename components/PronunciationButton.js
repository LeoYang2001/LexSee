import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const PronunciationButton = ({ audioUrl }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playAudio = async () => {
    if (!audioUrl) {
      console.log("No audio available");
      return;
    }

    if (sound) {
      await sound.unloadAsync(); // Unload any previous sound
    }

    try {
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: audioUrl });
      setSound(newSound);
      setIsPlaying(true);

      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Reset the state when playback finishes
        }
      });
    } catch (error) {
      console.log('Error loading or playing sound:', error);
      setIsPlaying(false);
    }
  };

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <TouchableOpacity
        onPress={playAudio}
        style={{
          padding: 10,
          backgroundColor: isPlaying ? '#ccc' : '#4CAF50',
          borderRadius: 5,
        }}
      >
        <Text style={{ color: '#fff' }}>
          {isPlaying ? 'Playing...' : 'Play Pronunciation'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

  export default PronunciationButton