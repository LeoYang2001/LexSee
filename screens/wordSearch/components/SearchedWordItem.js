import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Bookmark } from "lucide-react-native";

const SearchedWordItem = ({ searchedWord }) => {
  console.log(searchedWord);
  return (
    <TouchableOpacity
      className="w-full px-2 py-2 flex flex-row my-2 justify-between  items-center"
      style={{
        height: 40,
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
