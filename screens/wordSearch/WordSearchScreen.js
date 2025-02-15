import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { ChevronLeft, CircleX } from "lucide-react-native";
import SearchedWordItem from "./components/SearchedWordItem";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import languageCodes from "../../constants";

const WordSearchScreen = ({ navigation }) => {
  //Search Bar Functions
  const [inputText, setInputText] = useState("");
  const [wordSuggestion, setWordSuggestion] = useState([]);
  const inputRef = useRef(null);

  //SelectedLanguage
  const selectedLanguage = useSelector(
    (state) => state.userInfo.profile.selectedLanguage
  );

  //fetch word suggestions based on selected language
  const fetchWordSuggestion = async () => {
    if (selectedLanguage !== "en") return;
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

  const uid = auth.currentUser?.uid;

  const handleSearchWord = (word) => {
    //if its not in wordsList, navigate to definition with wordItem = searchedWord.word
    navigation.navigate("Definition", {
      wordItem: word,
      ifSaved: false,
    });
    //else, it's been saved, fetch wordItem from savedWordList
    // and pass wordItem to the definition page
  };

  //SearchedHistory will be fetched from firebase
  const searchedHistory =
    useSelector((state) => {
      try {
        return state.userInfo.searchedHistory; // Parse the stringified word list
      } catch (error) {
        console.log("Error parsing savedWordList from  searchHistory:", error);
        return [];
      }
    }) || [];

  const clearHistoryFromFirebase = async () => {
    try {
      if (!uid) {
        console.error("UID is required to clear search history.");
        return;
      }

      // Show confirmation alert
      Alert.alert(
        "Confirm Action",
        "Are you sure you want to clear your search history?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Operation canceled."),
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              // Reference to the user's document
              const userDocRef = doc(db, "users", uid);

              // Update the document by setting searchHistory to an empty array
              await updateDoc(userDocRef, {
                searchHistory: [],
              });

              console.log("Search history cleared successfully.");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setInputText("");

      return () => {
        console.log("Screen is no longer focused");
      };
    }, [])
  );

  //word suggestion API function
  useEffect(() => {
    if (!inputText) {
      console.log("empty suggestions..");
      setWordSuggestion([]);
    }

    if (inputText.length === 0) {
      setWordSuggestion([]);
      return;
    }
    fetchWordSuggestion();
  }, [inputText]);

  //auto focus the input
  useEffect(() => {
    if (inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
      }}
    >
      <View
        style={{
          backgroundColor: "#181d24",
        }}
        className=" flex flex-col p-4 pt-16 w-full h-full"
      >
        {/* HEADER */}
        <View
          style={{ height: 58 }}
          className="w-full flex-row justify-between items-center"
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeft color={"#fff"} />
          </TouchableOpacity>
          <View className="flex flex-row gap-4 items-center">
            <TouchableOpacity className=" flex flex-row   items-center justify-center">
              <Text
                style={{
                  opacity: 0.7,
                  color: "#FFFFFF",
                }}
                className=" mr-2"
              >
                {languageCodes[selectedLanguage]}
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
          </View>
        </View>
        {/* Search Input  */}
        <View
          style={{
            height: 49,
            backgroundColor: "#3d3f44",
            borderRadius: 12,
          }}
          className={`w-full relative z-20  mt-8  `}
        >
          <TextInput
            ref={inputRef}
            className="text-lg w-full py-2 px-4 text-white "
            value={inputText}
            onChangeText={setInputText}
            onEndEditing={() => {
              if (inputText.trim()) {
                handleSearchWord(inputText.trim());
              }
            }}
          />
          {inputText && (
            <Pressable
              onPress={() => {
                setInputText("");
              }}
              className="absolute h-full flex justify-center items-center mr-4  right-0 z-0"
            >
              <CircleX color={"#3d3f44"} fill={"#ffffff80"} fontSize={12} />
            </Pressable>
          )}
        </View>

        {/* Search History List  */}
        {wordSuggestion.length === 0 ? (
          <View className="flex-1  w-full  mt-8 flex flex-col ">
            <View className="w-full flex  flex-row justify-between">
              <Text
                style={{
                  fontSize: 12,
                  opacity: 0.7,
                  color: "#fff",
                }}
              >
                History
              </Text>
              <TouchableOpacity onPress={clearHistoryFromFirebase}>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#fff",
                    opacity: 0.5,
                  }}
                >
                  Clear all
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView className=" mt-4 flex-1 w-full">
              {searchedHistory
                .slice()
                .reverse()
                .map((searchedWord, index) => (
                  <SearchedWordItem
                    key={index}
                    searchedWord={searchedWord}
                    navigation={navigation}
                  />
                ))}
            </ScrollView>
          </View>
        ) : (
          <ScrollView className=" mt-4 flex-1 w-full">
            {wordSuggestion.slice(0, 12).map((wordItem, index) => {
              if (
                wordItem.word.length > 1 &&
                wordItem.word.split(" ").length === 1
              ) {
                return (
                  <SearchedWordItem
                    navigation={navigation}
                    key={index}
                    searchedWord={wordItem}
                  />
                );
              }
              return null;
            })}
          </ScrollView>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default WordSearchScreen;
