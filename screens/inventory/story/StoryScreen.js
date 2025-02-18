import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Pressable,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft, PencilLine } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { auth, db } from "../../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";

const StoryContent = ({ isHighlight, storyData }) => {
  const renderStoryText = () => {
    const words = storyData.story.split(" "); // Split story into words by space
    const regex = /^<[^>]+>$/;

    return words.map((word, index) => {
      const wordWithoutPunctuation = word.replace(/[.,!?;:()"'`]/g, "");
      let isHighlighted = regex.test(wordWithoutPunctuation.trim());
      const ifPunctuation = /[.!?;:,]$/.test(word);

      if (isHighlighted) {
        const formattedHighlightedWord = ifPunctuation
          ? [
              word.replace(/[<>]/g, "").slice(0, -1),
              word.replace(/[<>]/g, "")[word.replace(/[<>]/g, "").length - 1],
            ]
          : [word.replace(/[<>]/g, "")];
        return (
          <TouchableOpacity className="flex flex-row items-center" key={index}>
            <Text
              style={{
                fontSize: 16,
                color: isHighlight ? "#FA541C" : "#fff",
                opacity: isHighlight ? 1 : 0.8,
                lineHeight: 24,
                marginRight: 2, // Space out words slightly
              }}
            >
              {formattedHighlightedWord[0]}
            </Text>
            {formattedHighlightedWord.length > 1 ? (
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  opacity: 0.8,
                  lineHeight: 24,
                  marginRight: 2, // Space out words slightly
                }}
              >
                {formattedHighlightedWord[1]}{" "}
              </Text>
            ) : (
              <Text
                style={{
                  fontSize: 16,
                  color: "#fff",
                  opacity: 0.8,
                  lineHeight: 24,
                  marginRight: 2, // Space out words slightly
                }}
              >
                {" "}
              </Text>
            )}
          </TouchableOpacity>
        );
      } else
        return (
          <Pressable
            onLongPress={() => {
              console.log(word);
            }}
            key={index}
          >
            <Text
              style={{
                fontSize: 16,
                color: isHighlighted ? "#e6511f" : "#fff", // Highlight words wrapped with < >
                opacity: 0.8,
                lineHeight: 24,
                marginRight: 2, // Space out words slightly
              }}
            >
              {word}{" "}
            </Text>
          </Pressable>
        );
    });
  };
  return <Text>{renderStoryText()}</Text>;
};

const StoryContentTyping = ({ storyData }) => {
  return (
    <Text>
      <Text
        style={{
          fontSize: 16,
          color: "#fff",
          opacity: 0.8,
          lineHeight: 24,
          marginRight: 2, // Space out words slightly
        }}
      >
        {storyData.story}
      </Text>
    </Text>
  );
};

const StoryScreen = ({ navigation, route }) => {
  const uid = auth?.currentUser?.uid;
  const [isHighlight, setIsHighlight] = useState(false);
  const [isSavingStory, setIsSavingStory] = useState(false);

  const storyData = route?.params?.storyData;
  const ifNewStory = route?.params?.ifNewStory;

  useEffect(() => {
    if (ifNewStory) handleSavingStory();
  }, [ifNewStory]);

  const handleSavingStory = async () => {
    try {
      if (!uid) {
        alert("User is not logged in!");
        return;
      }

      setIsSavingStory(true);
      // Step 1: Packetize the story object
      const storyId = uid + "_" + new Date().toISOString(); // Unique story ID
      const packetizedStory = {
        storyId,
        ...storyData,
        createdAt: new Date().toISOString(),
      };

      // Step 2: Save to Firestore
      await setDoc(
        doc(collection(db, "users", uid, "storyList"), storyId),
        packetizedStory
      );

      console.log("Story saved successfully!");
      setIsSavingStory(false);
    } catch (error) {
      console.error("Error saving story:", error);
      alert("Failed to save story. Please try again.");
    }
  };

  const toggleSwitch = () => setIsHighlight((previousState) => !previousState);

  // Function to render the text with highlighted words

  return (
    <View
      style={{ backgroundColor: "#15181E" }}
      className="h-full w-full pt-16 flex flex-col"
    >
      <View className="z-20 flex flex-row items-center  justify-between">
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            if (isSavingStory) {
              alert("please wait until story saving complete!");
            } else {
              navigation.goBack();
            }
          }}
        >
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
        <View className="mr-2">
          {isSavingStory && <ActivityIndicator color={"#FA541C"} />}
        </View>
      </View>
      {/* STORY CONTENT  */}
      <ScrollView className="flex-1 p-4 pb-8">
        <StoryContent isHighlight={isHighlight} storyData={storyData} />
        {/* <StoryContentTyping storyData={storyData} /> */}
      </ScrollView>
      {/* Story Info Card */}
      <LinearGradient
        colors={["#333a48", "#2d2e35"]}
        className="w-full p-6 flex flex-col justify-between"
        style={{
          height: 160,
          borderTopRightRadius: 16,
          borderTopLeftRadius: 16,
        }}
      >
        <View className="flex flex-row w-full justify-between items-center">
          <View style={{ maxWidth: 250 }}>
            <Text
              className="font-semibold"
              style={{
                fontSize: 20,
                color: "#fff",
                opacity: 0.8,
                lineHeight: 28,
              }}
            >
              {storyData.storyName}
            </Text>
          </View>
          <TouchableOpacity
            className="flex justify-center items-center"
            style={{
              height: 42,
              width: 42,
              backgroundColor: "#464b56",
              borderRadius: 12,
            }}
          >
            <PencilLine color={"#90939a"} fill={"#90939a"} size={24} />
          </TouchableOpacity>
        </View>
        <View className="flex flex-row justify-start items-center">
          <Switch
            trackColor={{ false: "#828488", true: "#e6511f" }}
            thumbColor={isHighlight ? "#f7cabd" : "#cdced0"}
            ios_backgroundColor="#828488"
            onValueChange={toggleSwitch}
            value={isHighlight}
            style={{
              transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
            }}
          />
          <Text
            className="font-semibold ml-2"
            style={{
              color: "#fff",
              opacity: 0.3,
            }}
          >
            {storyData?.selectedWords?.storyWords?.length} Words
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
};

export default StoryScreen;
