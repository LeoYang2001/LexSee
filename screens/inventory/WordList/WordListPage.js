import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import WordCard from "./WordCard";

const WordListPage = () => {
  const mockWordsList = [
    {
      word: "word1 ",
      phonotics: "/wɜːd/",
      timeStamp: "2024-12-07T14:31:19.391Z",
    },
    {
      word: "word1 ",
      phonotics: "/wɜːd/",
      timeStamp: "2024-12-07T14:31:19.391Z",
    },
    ,
    {
      word: "word1 ",
      phonotics: "/wɜːd/",
      timeStamp: "2023-11-07T14:31:19.391Z",
    },
    ,
    {
      word: "word1 ",
      phonotics: "/wɜːd/",
      timeStamp: "2023-11-07T14:31:19.391Z",
    },
  ];

  const [sortMethod, setSortMethod] = useState("desc");

  const toggleSort = () => {
    setSortMethod(sortMethod === "desc" ? "asc" : "desc");
  };

  return (
    <View>
      {/*Sort*/}
      <View
        style={{ width: "100%", height: 58 }}
        className="justify-around items-center flex flex-row"
      >
        <TouchableOpacity
          onPress={toggleSort}
          className="flex flex-row flex-1 justify-center items-center"
        >
          <Text style={{ fontSize: 14, opacity: 0.7 }} className="text-white">
            {sortMethod === "desc" ? "Descending time" : "Ascending time"}
          </Text>

          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 5,
              borderRightWidth: 5,
              borderBottomWidth: 8,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderBottomColor: "#ffffffa1",
              marginLeft: 5,
              transform: `rotate(${sortMethod === "desc" ? 180 : 0}deg)`,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row flex-1 justify-center items-center">
          <Text style={{ fontSize: 14, opacity: 0.7 }} className="text-white">
            Graphics context
          </Text>
          <ChevronDown color="white" size={10} />
        </TouchableOpacity>
      </View>
      {/*Card*/}
      {mockWordsList.map((worditem, index) => {
        return (
          <WordCard
            word={worditem.word}
            pronunciation={worditem.phonotics}
            key={index}
          />
        );
      })}
    </View>
  );
};

export default WordListPage;
