import { View, TouchableOpacity, Image, Text } from "react-native";
import React, { useEffect, useState } from "react";
import SvgComponent from "./SvgComponent";
import { convertTimestampToDateFormat } from "../../../../utilities";
import { EllipsisVertical } from "lucide-react-native";

const WordPicCard = ({ imgUrl, rotateDegree }) => {
  return (
    <View
      style={{
        width: 266,
        height: 120,
      }}
      className="absolute"
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 12,
          transform: `rotate(${rotateDegree}deg) translateX(${rotateDegree}px)`,
        }}
        source={{
          uri: imgUrl,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export const StoryFolderItemLoading = () => {
  const [dotCount, setDotCount] = useState(0); // Track the number of dots

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDotCount((prevCount) => (prevCount % 3) + 1); // Cycle through 0, 1, 2, 3
    }, 250); // Update every 500ms

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  // Create the "Creating..." text with the correct number of dots
  const creatingText = `Creating${".".repeat(dotCount)}`;

  return (
    <View
      className="w-full mb-4 flex justify-center items-center"
      style={{
        height: 188,
        borderRadius: 16,
        backgroundColor: "#15181E",
      }}
    >
      <SvgComponent />
      <Text className="text-xl font-semibold text-white">{creatingText}</Text>
    </View>
  );
};

const StoryFolderItem = ({ storyItem }) => {
  const generateSymmetricDegrees = (n) => {
    if (n <= 0) return [];
    const degrees = [];
    const step = 7;
    for (let i = 0; i < n; i++) {
      const offset = Math.ceil(i / 2) * step * (i % 2 === 0 ? 1 : -1);
      degrees.push(offset);
    }

    return degrees.sort((a, b) => a - b);
  };

  const degreeArray = generateSymmetricDegrees(storyItem.storyWords.length);

  return (
    <TouchableOpacity
      className="w-full  mb-4 flex justify-center items-center"
      style={{
        height: 188,
        borderRadius: 16,
        backgroundColor: "#15181E",
      }}
    >
      {storyItem?.storyWords?.map((wordItem, index) => (
        <WordPicCard
          rotateDegree={degreeArray[index]}
          key={wordItem.id}
          imgUrl={wordItem.imgUrl}
        />
      ))}

      {/* Folder Cover with a Curved Cut */}
      <SvgComponent />
      <View
        className="w-full absolute bottom-0 p-4 flex flex-row justify-between items-center"
        style={{ height: 132, zIndex: 999 }}
      >
        <View className=" h-full flex flex-col justify-between">
          <View>
            <Text
              className="font-semibold"
              style={{
                color: "#fff",
                opacity: 0.3,
                fontSize: 10,
              }}
            >
              Last edited{" "}
              {convertTimestampToDateFormat(storyItem.lastEditedTimeStamp)}
            </Text>
            <Text
              className="font-semibold"
              style={{
                fontSize: 18,
                color: "#fff",
                opacity: 0.9,
              }}
            >
              Story Name
            </Text>
          </View>
          <View>
            <Text
              className="font-semibold"
              style={{
                fontSize: 14,
                color: "#fff",
                opacity: 0.3,
              }}
            >
              {storyItem.storyWords.length} Words
            </Text>
          </View>
        </View>
        <TouchableOpacity className="  py-3 flex flex-col justify-center mt-4 items-center">
          <EllipsisVertical color={"#B9CEF0"} opacity={0.7} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default StoryFolderItem;
