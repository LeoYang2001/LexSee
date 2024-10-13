import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  SafeAreaView,
  Keyboard,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AlignLeft, Search, X } from "lucide-react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import { Button } from "react-native";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Audio } from "expo-av";

// Inside some component

// Word suggestion API = https://api.datamuse.com/sug?s=d&max=40

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

const MainScreen = ({ navigation }) => {
  const [inputText, setInputText] = useState("");
  const [wordSuggestion, setWordSuggestion] = useState([]);

  const labelTop = useSharedValue(0);
  const labelLeft = useSharedValue(0);
  const cardOpacity = useSharedValue(1);
  const [inputLabel, setInputLabel] = useState(false);
  const [latestWord, setLatestWord] = useState(null);

  useEffect(() => {
    setInputLabel(false);
    setInputText("");
  }, [navigation]);

  const searchWord = (word) => {
    setInputText("");
    navigation.navigate("Definition", {
      searchedWord: word,
    });
  };

  useEffect(() => {
    const user = auth.currentUser; // Get the current user

    if (user) {
      const userId = user.uid; // Get the current user's UID
      const wordListRef = collection(db, "users", userId, "wordList"); // Reference to the user's wordList subcollection

      // Query the wordList collection and order by timestamp, in descending order (newest first)
      const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

      // Subscribe to the words in the user's wordList collection
      const unsubscribe = onSnapshot(wordListQuery, (snapshot) => {
        const wordsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setLatestWord(wordsData[0]);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      //   setLoading(false); // If there's no user, stop loading
    }
  }, []);

  useEffect(() => {
    if (!inputText) setWordSuggestion([]);
    const fetchWordSuggestion = async () => {
      const res = await fetch(
        `https://api.datamuse.com/sug?s=${inputText}&max=40`
      );
      const rs = await res.json();
      if (rs.length > 0) setWordSuggestion(rs);
      else setWordSuggestion([]);
    };

    if (inputText.length === 0) {
      setWordSuggestion([]);
      return;
    }
    fetchWordSuggestion();
  }, [inputText]);

  useEffect(() => {
    const timeDur = 300;
    labelTop.value = withTiming(inputLabel ? -45 : 0, { duration: timeDur });
    cardOpacity.value = withTiming(inputLabel ? 0 : 1, { duration: timeDur });
    labelLeft.value = withTiming(inputLabel ? -16 : 0, { duration: timeDur });
  }, [inputLabel]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView className="flex-1">
        <View className="flex-1 px-10 py-10">
          {/* <Button title="Press me" onPress={() => { throw new Error('Hello, again, Sentry!'); }}/> */}

          {/* HEADER */}
          <View className="w-full flex-row justify-between">
            <TouchableOpacity
              className="p-3 flex justify-center rounded-xl bg-white items-center"
              onPress={() => {
                navigation.openDrawer();
              }}
            >
              <AlignLeft size={24} color={"black"} />
            </TouchableOpacity>
          </View>

          <View className="mt-12">
            <Text className="text-4xl font-bold">Dictionary</Text>

            <View
              className={`w-full mt-12 relative z-20  bg-gray-200  ${
                !inputText && "rounded-xl"
              }`}
            >
              <Animated.View
                style={{
                  top: labelTop,
                  left: labelLeft,
                }}
                className="absolute h-full flex justify-center items-center ml-4  z-0"
              >
                <Search color={inputLabel ? "black" : "gray"} fontSize={14} />
              </Animated.View>
              <TextInput
                className="text-lg w-full py-2 px-4 "
                value={inputText}
                onChangeText={setInputText}
                onBlur={() => {
                  if (!inputText) setInputLabel(false);
                }}
                onFocus={() => setInputLabel(true)}
              />
              {inputLabel && inputText && (
                <Pressable
                  onPress={() => {
                    setInputText("");
                  }}
                  className="absolute h-full flex justify-center items-center mr-4  right-0 z-0"
                >
                  <X color={"gray"} fontSize={14} />
                </Pressable>
              )}
              {wordSuggestion.length > 0 && inputText && (
                <ScrollView
                  style={{
                    top: "100%",
                  }}
                  className=" absolute w-full  bg-gray-200 rounded-b-xl z-20 px-4 pb-4"
                >
                  {wordSuggestion.slice(0, 12).map((wordItem, index) => {
                    if (
                      wordItem.word.length > 1 &&
                      wordItem.word.split(" ").length === 1
                    ) {
                      return (
                        <TouchableOpacity
                          className="my-1"
                          key={`${wordItem.word}-${index}`}
                          onPress={() => {
                            searchWord(wordItem.word);
                          }}
                        >
                          <Text className="text-lg ">{wordItem.word}</Text>
                        </TouchableOpacity>
                      );
                    }
                    return null;
                  })}
                </ScrollView>
              )}
            </View>

            <Animated.View
              style={{
                top: 105,
                backgroundColor: "black",
                opacity: cardOpacity,
              }}
              className="rounded-xl p-6 "
            >
              <Pressable
                className="flex-col  justify-between "
                style={{
                  height: 300,
                }}
              >
                {latestWord ? (
                  <>
                    <View>
                      <Text className="text-white font-thin">
                        Last saved word
                      </Text>
                      <View className="flex-row  items-center ">
                        <Text className="text-white font-semibold text-2xl">
                          {latestWord.id}
                        </Text>
                        {latestWord?.phonetics && (
                          <Text className="text-gray-400 text-sm ml-3">
                            {latestWord?.phonetics?.text}
                          </Text>
                        )}
                      </View>
                    </View>
                    <Image
                      source={{ uri: latestWord.imgUrl }}
                      style={{
                        width: "100%",
                        height: 150,
                        borderRadius: 8,
                        marginTop: 10,
                      }} // Adjust height as needed
                      resizeMode="cover" // Adjust to 'contain' if you want the image to fit inside the box
                    />
                    <View className="flex-row justify-between">
                      <ListenButton audioUrl={latestWord?.phonetics?.audio} />
                      <TouchableOpacity className="rounded-xl bg-white p-3">
                        <Text className="text-black font-semibold">
                          View more
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <ActivityIndicator color={"white"} />
                )}
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default MainScreen;
