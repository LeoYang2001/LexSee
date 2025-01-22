import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import NestedSheetPlaceHolder from "./nestedSheetPlaceHolder/NestedSheetPlaceHolder";
import { ChevronLeft } from "lucide-react-native";
import { fetchDefinition } from "../../gptFunctions";
import OpenAI from "openai";
import Constants from "expo-constants";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const DefinitionScreen = ({ navigation, route }) => {
  const [pageTitle, setPageTitle] = useState("Explanation");

  const ifSaved = route.params.ifSaved;
  const initWordItem = ifSaved
    ? JSON.parse(route.params.wordItem)
    : route.params.wordItem;
  const [wordItem, setWordItem] = useState(initWordItem);

  console.log(initWordItem);

  // *** AI FUNCTIONS***
  const chatgptApiKey =
    Constants.expoConfig.extra.chatgptApiKey ||
    process.env.EXPO_DOT_CHATGPT_KEY;
  console.log("chatgptApiKey:");
  console.log(chatgptApiKey);
  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  const uid = auth.currentUser?.uid; // Get current user UID

  const pushToSearchHistory = async (uid, searchedWord) => {
    try {
      // Reference to the user's document
      const userDocRef = doc(db, "users", uid);

      // Check if the document exists
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        // If the document doesn't exist, create it and initialize the searchHistory
        await setDoc(userDocRef, { searchHistory: [searchedWord] });
        console.log("Document created and word added to search history.");
      } else {
        // If the document exists, retrieve the current search history
        const currentData = userDocSnap.data();
        const searchHistory = currentData.searchHistory || [];

        // Remove the word if it exists in the array
        const filteredHistory = searchHistory.filter(
          (word) => word !== searchedWord
        );

        // Add the new word to the bottom
        filteredHistory.push(searchedWord);

        // Update the search history in Firestore
        await updateDoc(userDocRef, {
          searchHistory: filteredHistory,
        });
        console.log(
          "Word added to existing search history without duplicates."
        );
      }
    } catch (error) {
      console.error("Error updating search history:", error);
    }
  };

  useEffect(() => {
    //if its an unsaved word than fetch definition
    //push the word to searchHistory by uid
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
          pushToSearchHistory(uid, fetchedWord?.id);
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
