import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Bookmark } from "lucide-react-native";

const countSelectedWords = (groupedWords) => {
  return groupedWords.reduce((totalCount, group) => {
    const countInGroup = group.wordsList.filter(
      (word) => word.ifSelectedForStory === true
    ).length;
    return totalCount + countInGroup;
  }, 0);
};

const StoryToolBar = ({
  sortedWordsList,
  cancelToolBar,
  handleCreatingStory,
}) => {
  const [selectedNum, setSelectedNum] = useState(0);
  useEffect(() => {
    if (sortedWordsList) {
      setSelectedNum(countSelectedWords(sortedWordsList));
    }
  }, [sortedWordsList]);

  const toolBarList = [
    {
      label: "Delete    ",
      icon: () => {
        return (
          <Bookmark color={"#fff"} fill={"#fff"} size={28} opacity={0.8} />
        );
      },
      handleEvent: () => {},
    },
    {
      label: "New story",
      icon: () => {
        return (
          <Bookmark color={"#fff"} fill={"#fff"} size={28} opacity={0.8} />
        );
      },
      handleEvent: () => {
        handleCreatingStory();
      },
    },
    {
      label: "Cancel",
      icon: () => {
        return (
          <Bookmark color={"#fff"} fill={"#fff"} size={28} opacity={0.8} />
        );
      },
      handleEvent: () => {
        cancelToolBar();
      },
    },
  ];

  return (
    <LinearGradient
      colors={["#c54923", "#b43d18"]}
      style={{
        height: 90,
        opacity: 0.9,
        borderRadius: 12,
      }}
      className="w-full flex flex-row items-center justify-between px-6"
    >
      <View
        style={{
          width: 93,
        }}
        className="h-full flex flex-row  justify-center items-center"
      >
        <Text
          className="mr-2"
          style={{
            fontSize: 32,
            color: "#fff",
            opacity: 0.9,
          }}
        >
          {selectedNum}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#fff",
            opacity: 0.7,
          }}
        >
          Selected
        </Text>
      </View>
      <View
        style={{
          width: 1,
          height: 12,
          backgroundColor: "#fff",
          opacity: 0.4,
        }}
      />
      <View className="h-full  flex flex-row items-center ">
        {toolBarList.map((toolBarItem) => (
          <TouchableOpacity
            onPress={toolBarItem.handleEvent}
            style={{
              width: 72,
            }}
            className="flex flex-col justify-center items-center   "
            key={toolBarItem.label}
          >
            {toolBarItem.icon()}
            <Text
              className="mt-2"
              style={{
                fontSize: 12,
                color: "#fff",
                opacity: 0.7,
              }}
            >
              {toolBarItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

export default StoryToolBar;
