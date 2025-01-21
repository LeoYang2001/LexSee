import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import NestedSheetPlaceHolder from "./nestedSheetPlaceHolder/NestedSheetPlaceHolder";
import { ChevronLeft } from "lucide-react-native";
import { fetchDefinition } from "../../gptFunctions";
import OpenAI from "openai";
import Constants from "expo-constants";

const DefinitionScreen = ({ navigation, route }) => {
  const [pageTitle, setPageTitle] = useState("Explanation");

  const ifSaved = route.params.ifSaved;
  const initWordItem = ifSaved
    ? JSON.parse(route.params.wordItem)
    : route.params.wordItem;
  const [wordItem, setWordItem] = useState(initWordItem);

  // *** AI FUNCTIONS***
  const chatgptApiKey =
    Constants.expoConfig.extra.chatgptApiKey ||
    process.env.EXPO_DOT_CHATGPT_KEY;
  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  useEffect(() => {
    //if its an unsaved word than fetch definition
    const fetchWordDefinition = async () => {
      if (!wordItem?.id) {
        console.log("Fetching the definition of:", wordItem);
        try {
          const fetchedWord = await fetchDefinition(
            openai,
            wordItem,
            "English"
          );
          console.log("Fetched Word:", fetchedWord);
          if (!fetchedWord) {
            //if fetchedWord == null, then navigate back
            navigation.goBack();
          }
          setWordItem(fetchedWord);
        } catch (error) {
          console.error("Error fetching definition:", error);
        }
      }
    };
    fetchWordDefinition();
  }, []);

  return wordItem?.id ? (
    <View
      style={{
        backgroundColor: "#121417",
      }}
      className="w-full h-full relative"
    >
      {/* Header  */}
      <View className=" pt-10  flex flex-row items-center px-4 justify-between">
        <TouchableOpacity
          className=" p-2"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            opacity: 0.5,
          }}
          className="text-lg text-red-500  py-4"
        >
          {pageTitle}
        </Text>
        <TouchableOpacity className=" p-2 opacity-0">
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: "86%",
        }}
        className="w-full absolute bottom-0"
      >
        <NestedSheetPlaceHolder
          wordItem={wordItem}
          ifSaved={ifSaved}
          setPageTitle={setPageTitle}
          pageTitle={pageTitle}
        />
      </View>
    </View>
  ) : (
    <View
      style={{
        backgroundColor: "#121417",
      }}
      className="w-full h-full flex justify-center items-center"
    >
      <ActivityIndicator />
    </View>
  );
};

export default DefinitionScreen;
