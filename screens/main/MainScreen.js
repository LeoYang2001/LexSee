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
  ImageBackground,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AlignLeft, ChevronDown, Search, X } from "lucide-react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";

import { Button } from "react-native";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Audio } from "expo-av";
import { auth, db } from "../../firebase";
import Logo from "../../components-shared/Logo";
import InventoryStatistic from "./components/InventoryStatistic";
import WordFlexCard from "../../components-shared/WordFlexCard";

// Inside some component

// Word suggestion API = https://api.datamuse.com/sug?s=d&max=40

const MainScreen = ({ navigation, savedWord }) => {
  const [inputText, setInputText] = useState("");
  const [wordSuggestion, setWordSuggestion] = useState([]);

  const rotateDeg = useSharedValue(0);
  const searchIconOpacity = useSharedValue(1);
  const cardOpacity = useSharedValue(1);
  const [inputLabel, setInputLabel] = useState(false);
  const [latestWord, setLatestWord] = useState(null);
  const inputRef = useRef(null);

  const mockWordList = [
    {
      id: "culpable",
      imgUrl: "https://cdn.langeek.co/photo/23505/original/?type=jpeg",
      meanings: [
        {
          antonyms: [],
          definitions: [
            "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
          ],
          partOfSpeech: "adjective",
          synonyms: [],
        },
      ],
      phonetics: {
        audio:
          "https://api.dictionaryapi.dev/media/pronunciations/en/culpable-us.mp3",
        license: {
          name: "BY-SA 3.0",
          url: "https://creativecommons.org/licenses/by-sa/3.0",
        },
        sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=789670",
        text: "/ˈkʌlpəbəl/",
      },
      timeStamp: "2024-11-03T23:14:17.405Z",
    },
    {
      id: "demo",
      imgUrl: "https://cdn.langeek.co/photo/23505/original/?type=jpeg",
      meanings: [
        {
          antonyms: [],
          definitions: [
            "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
          ],
          partOfSpeech: "adjective",
          synonyms: [],
        },
      ],
      phonetics: {
        audio:
          "https://api.dictionaryapi.dev/media/pronunciations/en/culpable-us.mp3",
        license: {
          name: "BY-SA 3.0",
          url: "https://creativecommons.org/licenses/by-sa/3.0",
        },
        sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=789670",
        text: "/ˈkʌlpəbəl/",
      },
      timeStamp: "2024-11-03T23:14:17.405Z",
    },
  ];
  //Active flexCard Id
  const [activeCardId, setActiveCardId] = useState(null);

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
    if (savedWord) {
      return setLatestWord(savedWord);
    } else {
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
    }
  }, []);

  useEffect(() => {
    if (!inputText) setWordSuggestion([]);
    const fetchWordSuggestion = async () => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/sug?s=${inputText.trim()}&max=40`
        );
        const rs = await res.json();
        if (rs.length > 0) setWordSuggestion(rs);
        else setWordSuggestion([]);
      } catch (error) {
        console.log("word suggestion api error: ");
        console.log(error);
      }
    };

    if (inputText.length === 0) {
      setWordSuggestion([]);
      return;
    }
    fetchWordSuggestion();
  }, [inputText]);

  useEffect(() => {
    const timeDur = 300;
    if (!inputLabel) {
      rotateDeg.value = withTiming(90, { duration: timeDur });
      cardOpacity.value = withTiming(1, { duration: timeDur });
      searchIconOpacity.value = withTiming(1, { duration: timeDur });
    } else {
      rotateDeg.value = withTiming(0, { duration: timeDur });
      cardOpacity.value = withTiming(0, { duration: timeDur });
      searchIconOpacity.value = withTiming(0, { duration: timeDur });
    }
  }, [inputLabel]);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveCardId(null);
      }}
    >
      <View
        style={{
          backgroundColor: "#181d24",
        }}
        className="flex-1 pt-16"
      >
        <View
          style={{
            paddingHorizontal: 18,
          }}
          className="flex-1 flex flex-col    p-4"
        >
          {/* HEADER */}
          <View
            style={{ height: 58 }}
            className="w-full flex-row justify-between items-center"
          >
            <View>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 18,
                }}
                className="font-semibold z-30"
              >
                LexSee
              </Text>
              <View className=" absolute self-center top-3">
                <Logo size={22} />
              </View>
            </View>
            <View className="flex flex-row gap-4 items-center">
              <TouchableOpacity className=" flex flex-row gap-1  items-center justify-center">
                <Text
                  style={{
                    opacity: 0.7,
                    color: "#FFFFFF",
                  }}
                >
                  English
                </Text>
                <View
                  style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: 6, // Adjust for size
                    borderRightWidth: 6, // Adjust for size
                    borderTopWidth: 7, // Adjust for size
                    borderLeftColor: "transparent",
                    borderRightColor: "transparent",
                    borderTopColor: "#C9CDD4",
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.openDrawer();
                }}
                className=" flex flex-col gap-1 p-3 "
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#fff",
                    width: 18,
                    borderRadius: 1,
                  }}
                />
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#fff",
                    width: 18,
                    borderRadius: 1,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Search Input  */}
          <View
            style={{
              height: 49,
              backgroundColor: "#3d3f44",
              borderRadius: 12,
              borderBottomRightRadius: wordSuggestion.length > 0 ? 0 : 12,
              borderBottomLeftRadius: wordSuggestion.length > 0 ? 0 : 12,
            }}
            className={`w-full relative z-20  mt-8  `}
          >
            <Animated.View
              style={{
                transform: `rotate(${rotateDeg}deg)`,
                opacity: searchIconOpacity,
              }}
              className="absolute h-full flex justify-center items-center ml-4  z-0"
            >
              <Search color={"#fff"} fontSize={14} />
            </Animated.View>
            <TextInput
              ref={inputRef}
              className="text-lg w-full py-2 px-4 text-white "
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
                  backgroundColor: "#3d3f44",
                }}
                className=" absolute w-full  rounded-b-xl z-20 px-4 pb-4"
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
                        <Text className="text-lg  text-white">
                          {wordItem.word}
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })}
              </ScrollView>
            )}
          </View>
          {/* Inventory Statistic  */}
          <View className="mt-8">
            <InventoryStatistic />
          </View>
          <Animated.View
            style={{
              opacity: cardOpacity,
            }}
            className=" mt-8 flex-1 "
          >
            {/* Filter  */}
            <View className="w-full  mb-4 flex flex-row justify-between">
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                  opacity: 0.7,
                }}
              >
                Recently Pinned
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                  opacity: 0.7,
                }}
              >
                All
              </Text>
            </View>
            <ScrollView>
              {mockWordList.map((word) => (
                <WordFlexCard
                  navigation={navigation}
                  ifActive={activeCardId === word.id}
                  setActiveCardId={setActiveCardId}
                  wordItem={word}
                  key={word.id}
                />
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MainScreen;
