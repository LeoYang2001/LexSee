import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Bookmark } from "lucide-react-native";
import * as Haptics from "expo-haptics";

const SearchedWordItem = ({ searchedWord, navigation }) => {
  const handleSearchWord = (word) => {
    //if its not in wordsList, navigate to definition with wordItem = searchedWord.word
    navigation.navigate("Definition", {
      wordItem: word,
      ifSaved: false,
    });
    //else, it's been saved, fetch wordItem from savedWordList
    // and pass wordItem to the definition page
  };
  return (
    <TouchableOpacity
      className="w-full px-2 py-2 flex flex-row my-2 justify-between  items-center"
      style={{
        height: 40,
      }}
      onPress={() => {
        handleSearchWord(searchedWord.word);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        console.log("light feedback");
      }}
    >
      <Text
        className="font-semibold"
        style={{
          fontSize: 16,
          color: "#fff",
          opacity: 0.7,
        }}
      >
        {searchedWord.word}
      </Text>
      <Bookmark
        color={"transparent"}
        fill={searchedWord.ifSaved ? "#FA541C" : "#ffffff19"}
      />
    </TouchableOpacity>
  );
};

export default SearchedWordItem;
