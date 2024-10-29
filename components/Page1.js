import { View, Text, ScrollView } from "react-native";
import React, { useState } from "react";

const ListenButton = ({ audioUrl }) => {
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
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      setSound(newSound);
      setIsPlaying(true);

      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          setIsPlaying(false); // Reset the state when playback finishes
        }
      });
    } catch (error) {
      console.log("Error loading or playing sound:", error);
      setIsPlaying(false);
    }
  };

  return (
    <TouchableOpacity
      disabled={isPlaying}
      onPress={playAudio}
      className="rounded-xl bg-white p-3"
    >
      {!isPlaying ? (
        <Text className="text-black font-semibold">Listen</Text>
      ) : (
        <Text className="text-black font-semibold">Playing...</Text>
      )}
    </TouchableOpacity>
  );
};

const Page1 = ({ wordItem }) => {
  const { id, imgUrl, meanings, phonetics } = wordItem;
  console.log(wordItem);

  // Extracting the primary phonetic representation (first entry)
  const primaryPhonetic = phonetics[0] ? phonetics[0].text : "";

  return (
    <View className="flex-1 w-full py-6 pt-24 px-6">
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-3xl text-white">{id}</Text>
          <Text className="text-sm text-gray-300">{phonetics.text}</Text>
        </View>
        <View>
          <ListenButton audioUrl={phonetics.audio} />
        </View>
      </View>

      <ScrollView className="flex-1 border mt-4 border-red-500">
        {meanings.map((meaning, index) => (
          <View key={index} className="mb-4">
            <Text className="text-lg text-white font-semibold">
              {meaning.partOfSpeech}
            </Text>
            {meaning.definitions.map((definition, defIndex) => (
              <View key={defIndex} className="ml-4">
                <Text className="text-white">
                  {defIndex + 1}. {definition.definition}
                </Text>
                {definition.synonyms.length > 0 && (
                  <Text className="text-gray-300">
                    Synonyms: {definition.synonyms.join(", ")}
                  </Text>
                )}
                {definition.antonyms.length > 0 && (
                  <Text className="text-gray-300">
                    Antonyms: {definition.antonyms.join(", ")}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Page1;
