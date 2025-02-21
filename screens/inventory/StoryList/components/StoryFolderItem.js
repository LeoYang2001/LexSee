import { View, TouchableOpacity, Image, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import SvgComponent from "./SvgComponent";
import { convertTimestampToDateFormat } from "../../../../utilities";
import { EllipsisVertical } from "lucide-react-native";
import { auth, db } from "../../../../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { removeStoryFromSavedList } from "../../../../slices/userInfoSlice";

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
      <Text className="text-lg mt-12  font-semibold text-white opacity-60">
        {creatingText}
      </Text>
    </View>
  );
};

const StoryFolderItem = ({ storyItem, navigation }) => {
  const uid = auth?.currentUser?.uid;

  const dispatch = useDispatch();

  const selectedWords = storyItem?.selectedWords;
  const generateSymmetricDegrees = (n) => {
    if (n <= 0) return [];

    let maxAbsDegree = 20; // Maximum allowed absolute degree
    let step = Math.max(1, Math.floor(maxAbsDegree / (n / 2))); // Adjust step based on n
    const degrees = [];

    for (let i = 0; i < n; i++) {
      const offset = Math.ceil(i / 2) * step * (i % 2 === 0 ? 1 : -1);
      degrees.push(offset);
    }

    return degrees.sort((a, b) => a - b);
  };

  const handleDeleteStory = (storyItem) => {
    // Show confirmation dialog using Alert
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this story?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Story deletion cancelled."),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => deleteStoryById(uid, storyItem),
        },
      ]
    );
  };

  const deleteStoryById = async (uid, story) => {
    const storyId = story.id;
    if (!uid || !storyId) {
      console.error("Invalid parameters: uid and storyId are required.");
      return;
    }

    dispatch(removeStoryFromSavedList(story));

    try {
      const storyDocRef = doc(db, "users", uid, "storyList", storyId);
      await deleteDoc(storyDocRef);
      console.log(`Story with ID ${storyId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete the story. Please try again.");
    }
  };

  const degreeArray = generateSymmetricDegrees(selectedWords.storyWords.length);
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("Story", {
          storyData: { ...storyItem },
          ifNewStory: false,
        });
      }}
      className="w-full  mb-4 flex  overflow-hidden justify-center items-center"
      style={{
        height: 188,
        borderRadius: 16,
        backgroundColor: "#15181E",
      }}
    >
      {selectedWords?.storyWords?.map((wordItem, index) => (
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
              Last edited {convertTimestampToDateFormat(storyItem.createdAt)}
            </Text>
            <View
              style={{
                maxWidth: "90%",
              }}
            >
              <Text
                className="font-semibold"
                style={{
                  fontSize: 18,
                  color: "#fff",
                  opacity: 0.9,
                }}
              >
                {storyItem.storyName}
              </Text>
            </View>
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
              {selectedWords?.storyWords?.length} Words
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            handleDeleteStory(storyItem);
          }}
          className="  py-3 flex flex-col justify-center mt-4 items-center"
        >
          <EllipsisVertical color={"#B9CEF0"} opacity={0.7} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default StoryFolderItem;
