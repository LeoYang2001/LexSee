import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";

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

const Page1 = ({
  wordItem,
  navigation,
  bottomSheetModalRef,
  handleSelectingDef,
}) => {
  const { id, meanings, phonetics } = wordItem;

  const searchNewWord = (word) => {
    navigation.navigate("Definition", {
      searchedWord: word,
    });
  };

  return (
    <LinearGradient
      colors={["#000", "#0D0F1fff"]}
      className="flex-1 w-full  pt-24 px-6"
    >
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-2xl text-white">{id}</Text>
          {phonetics?.text && (
            <Text className="text-sm text-gray-300">{phonetics?.text}</Text>
          )}
        </View>
        <View>
          <ListenButton audioUrl={phonetics?.audio} />
        </View>
      </View>

      <ScrollView className="flex-1   mt-4">
        {meanings.map((meaning, index) => (
          <LinearGradient
            colors={["#323b4a", "#323b4a"]}
            key={index}
            className="mb-4 p-4 rounded-md shadow-md"
          >
            <Text
              style={{ color: "#9ba1ad" }}
              className="text-xl font-mono font-semibold"
            >
              {meaning.partOfSpeech}
            </Text>
            {meaning.definitions.map((definition, defIndex) => (
              <View key={defIndex}>
                <TouchableOpacity
                  onPress={() => {
                    handleSelectingDef(definition?.definition);
                  }}
                >
                  <Text className="text-white  my-2 font-mono">
                    {definition.definition}
                  </Text>
                </TouchableOpacity>
                {definition.synonyms.length > 0 && (
                  <>
                    <Text
                      style={{ color: "#9ba1ad" }}
                      className="text-lg underline font-mono my-2 font-semibold"
                    >
                      Synonyms
                    </Text>
                    <View className="flex-1 flex flex-row flex-wrap mb-2">
                      {definition?.synonyms?.map((syn) => (
                        <TouchableOpacity
                          onPress={() => {
                            searchNewWord(syn);
                            if (bottomSheetModalRef?.current) {
                              bottomSheetModalRef?.current.close();
                            }
                          }}
                          style={{
                            backgroundColor: "#323b4a",
                          }}
                          className=" shadow-md shadow-gray-900  p-2 mr-3 justify-center items-center rounded-md "
                          key={syn}
                        >
                          <Text style={{ color: "#9ba1ad" }}>{syn}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
                {definition.antonyms.length > 0 && (
                  // <Text className="text-gray-300">
                  //   Antonyms: {definition.antonyms.join(", ")}
                  // </Text>
                  <>
                    <Text
                      style={{ color: "#9ba1ad" }}
                      className="text-lg underline font-mono my-2 font-semibold"
                    >
                      Antonyms
                    </Text>
                    <View className="flex-1 flex flex-row flex-wrap mb-2">
                      {definition?.antonyms?.map((atn) => (
                        <TouchableOpacity
                          onPress={() => {
                            searchNewWord(atn);
                            if (bottomSheetModalRef?.current) {
                              bottomSheetModalRef?.current.close();
                            }
                          }}
                          style={{
                            backgroundColor: "#9ba1ad",
                          }}
                          className=" shadow-md shadow-gray-900  p-2 mr-3 justify-center items-center rounded-md "
                          key={atn}
                        >
                          <Text style={{ color: "#323b4a" }}>{atn}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </>
                )}
              </View>
            ))}
          </LinearGradient>
        ))}
      </ScrollView>
    </LinearGradient>
  );
};

export default Page1;
