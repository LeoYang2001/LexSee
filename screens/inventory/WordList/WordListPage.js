import { ChevronDown } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import StoryToolBar from "../components/StoryToolBar";
import WordCardForStory from "./components/WordCardForStory";
import WordCard from "./components/WordCard";
import OpenAI from "openai";
import Constants from "expo-constants";
import { fetchStory } from "../../../gptFunctions";
import { auth } from "../../../firebase";
// *** AI FUNCTIONS***
const chatgptApiKey =
  Constants.expoConfig.extra.chatgptApiKey || process.env.EXPO_DOT_CHATGPT_KEY;
const openai = new OpenAI({
  apiKey: chatgptApiKey,
});

const groupWordsByDate = (wordsList) => {
  // Sort words by timestamp in descending order (latest first)
  wordsList
    .slice()
    .sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));

  // Group words by date
  const groupedWords = wordsList.reduce((acc, word) => {
    const date = word.timeStamp.split("T")[0]; // Extract date part (YYYY-MM-DD)
    word = {
      ...word,
      ifSelectedForStory: false,
    };
    if (!acc[date]) {
      acc[date] = { date, wordsList: [] };
    }

    acc[date].wordsList.push(word);
    return acc;
  }, {});

  // Convert object values to array
  return Object.values(groupedWords);
};

const WordListPage = ({
  navigation,
  setIsGeneratingStory,
  handlePageChange,
}) => {
  const savedWordsFromStore = useSelector((state) => {
    try {
      return state.userInfo.savedWordList;
    } catch (error) {
      console.log("Error parsing savedWordList:", error);
      return [];
    }
  });

  const uid = auth.currentUser.uid;

  const wordsList_desc = groupWordsByDate(savedWordsFromStore);
  const wordsList_asc = groupWordsByDate(savedWordsFromStore).slice().reverse();

  const [sortMethod, setSortMethod] = useState("desc");
  const [sortedWordsList, setSortedWordsList] = useState(wordsList_desc);

  const [ifGraphic, setIfGraphic] = useState(false);
  const [ifCreatingStory, setIfCreatingStory] = useState(false);

  useEffect(() => {
    if (sortMethod === "desc") {
      setSortedWordsList(wordsList_desc);
    } else {
      setSortedWordsList(wordsList_asc);
    }
  }, [sortMethod]);

  const toggleWordSelection = (wordId) => {
    setSortedWordsList((prevWordsList) =>
      prevWordsList.map((group) => ({
        ...group,
        wordsList: group.wordsList.map((word) =>
          word.id === wordId
            ? { ...word, ifSelectedForStory: !word.ifSelectedForStory }
            : word
        ),
      }))
    );
  };

  const resetSelection = (data) => {
    console.log("resetting selection");
    return data.map((group) => ({
      ...group,
      wordsList: group.wordsList.map((word) => ({
        ...word,
        ifSelectedForStory: false,
      })),
    }));
  };

  const cancelToolBar = () => {
    //hide toolbar
    setIfCreatingStory(false);
    //reset
    setSortedWordsList(resetSelection(sortedWordsList));
  };

  //get selected words
  // Get selected words and transform the structure as required
  const getSelectedWords = (data) => {
    const currentTimestamp = new Date().toISOString(); // Get the current timestamp when the function is called

    return {
      lastEditedTimeStamp: currentTimestamp,
      storyWords: data.flatMap(
        (group) =>
          group.wordsList
            .filter((word) => word.ifSelectedForStory) // Filter selected words
            .map(
              ({ ifSelectedForStory, ...wordWithoutFlag }) => wordWithoutFlag
            ) // Remove the property
      ),
    };
  };

  //Go to story page and create story
  const handleCreatingStory = async () => {
    //step 0 get selected words
    const selectedWords = getSelectedWords(sortedWordsList);
    const wordsForPrompt = selectedWords.storyWords.map((word) => word.id);
    //step 1 reset and hide toolBar
    cancelToolBar();

    //step 2: switch to page story and display loading component
    handlePageChange("story");
    setIsGeneratingStory(true);
    let fetchedStory;
    //step 3: fetching story and update storyList (global variable)
    try {
      fetchedStory = await fetchStory(
        openai,
        wordsForPrompt,
        (language = "English")
      );
      console.log("Fetched Story:", fetchedStory);
    } catch (error) {
      console.error("Error fetching story:", error);
    }

    //step 4:
    setIsGeneratingStory(false);
    //step 5: navigate to the corresponding story page
    navigation.navigate("Story", {
      storyData: { ...fetchedStory, selectedWords },
      ifNewStory: true,
    });
  };

  const toggleSort = () => {
    setSortMethod(sortMethod === "desc" ? "asc" : "desc");
  };

  return (
    <View className=" h-full flex-1 flex-col relative">
      {/* Story ToolBar Component  */}
      {ifCreatingStory && (
        <View className="absolute  w-full px-2 bottom-8 z-50">
          <StoryToolBar
            cancelToolBar={cancelToolBar}
            handleCreatingStory={handleCreatingStory}
            sortedWordsList={sortedWordsList}
          />
        </View>
      )}
      {/*Sort*/}
      <View
        style={{ width: "100%", height: 58 }}
        className="justify-between items-center px-4 flex flex-row"
      >
        <TouchableOpacity
          disabled={ifCreatingStory}
          onPress={toggleSort}
          className="flex flex-row flex-1 justify-center items-center"
        >
          <Text
            style={{ fontSize: 14, opacity: ifCreatingStory ? 0.2 : 0.7 }}
            className="text-white"
          >
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
              opacity: ifCreatingStory ? 0.2 : 1,
              transform: `rotate(${sortMethod === "desc" ? 180 : 0}deg)`,
            }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setIfGraphic(!ifGraphic);
          }}
          className="flex flex-row flex-1 justify-center items-center"
        >
          <Text style={{ fontSize: 14, opacity: 0.7 }} className="text-white">
            Graphics context
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
              transform: `rotate(${!ifGraphic ? 180 : 0}deg)`,
            }}
          />
        </TouchableOpacity>
      </View>
      {/*Card*/}
      <ScrollView className="flex-1 w-full" alwaysBounceVertical={true}>
        {sortedWordsList.map((dateItem) => {
          return (
            <View className="border mb-3 mx-4 " key={dateItem.date}>
              <Text
                style={{
                  color: "#fff",
                  opacity: 0.6,
                }}
                className="text-white mb-4"
              >
                {dateItem.date}
              </Text>
              {dateItem?.wordsList.map((wordItem) => {
                return (
                  <View key={wordItem.id}>
                    {ifCreatingStory ? (
                      <WordCardForStory
                        toggleWordSelection={toggleWordSelection}
                        navigation={navigation}
                        ifGraphic={ifGraphic}
                        wordItem={wordItem}
                      />
                    ) : (
                      <Pressable
                        onLongPress={() => {
                          setIfCreatingStory(true);
                          toggleWordSelection(wordItem.id);
                        }}
                      >
                        <WordCard
                          navigation={navigation}
                          ifGraphic={ifGraphic}
                          wordItem={wordItem}
                        />
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
        {ifCreatingStory && (
          <View
            className="w-full  opacity-0"
            style={{
              height: 120,
            }}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default WordListPage;
