import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import NestedSheetPlaceHolder from "./nestedSheetPlaceHolder/NestedSheetPlaceHolder";
import { ChevronLeft } from "lucide-react-native";
import { fetchDefinition } from "../../gptFunctions";
import OpenAI from "openai";
import Constants from "expo-constants";
import { auth, db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import languageCodes from "../../constants";

const initialImgPlaceHolderUrl =
  "https://firebasestorage.googleapis.com/v0/b/lexseev2.firebasestorage.app/o/blurryImageGallery.png?alt=media&token=5c84a962-f121-4962-9cb7-d36fcc6d7ca9";

const DefinitionScreen = ({ navigation, route }) => {
  const [pageTitle, setPageTitle] = useState("Explanation");

  console.log(route);

  const [imgPlaceHolderUrl, setImgPlaceHolderUrl] = useState(
    initialImgPlaceHolderUrl
  );

  useEffect(() => {
    const updatedImgPlaceHolderUrl = route.params?.imgPlaceHolderUrl;
    if (updatedImgPlaceHolderUrl) {
      setImgPlaceHolderUrl(updatedImgPlaceHolderUrl);
    }
    console.log("imgPlaceHolderUrl:::");
    console.log(imgPlaceHolderUrl);
  }, [route]);

  //SelectedLanguage
  const selectedLanguage = useSelector(
    (state) => state.userInfo.profile.selectedLanguage
  );

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

  const uid = auth.currentUser?.uid; // Get current user UID

  const fetchAudioUrl = async (languageCode, text) => {
    const apiUrl =
      "https://converttexttospeech-lcwrfk4hzq-uc.a.run.app/convert-text-to-speech";

    // Prepare the request payload
    const requestData = {
      text: text,
      languageCode: languageCode,
    };

    try {
      // Send POST request to the API
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
        body: JSON.stringify(requestData), // Convert the data to JSON
      });

      // Check if the response is OK (status 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the response JSON
        return data.audioUrl; // Return the audio URL
      } else {
        console.error(
          "Failed to fetch audio URL:",
          response.status,
          response.statusText
        );
        return null;
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }
  };

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
            languageCodes[selectedLanguage]
          );
          console.log("Fetched Word:", fetchedWord);
          if (!fetchedWord) {
            //if fetchedWord == null, then navigate back
            navigation.goBack();
          }

          console.log("fetchedWord.phonetics:::______");
          console.log(fetchedWord.phonetics);

          const audioUrl = await fetchAudioUrl("en-US", fetchedWord.id);
          // Set the audio URL into phonetics object
          fetchedWord.phonetics.audioUrl = audioUrl;

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
      <View className=" pt-10  flex flex-row items-center px-4  justify-between">
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
          className="text-lg text-red-500 py-4"
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
          imgPlaceHolderUrl={imgPlaceHolderUrl}
          wordItem={wordItem}
          ifSaved={ifSaved}
          setPageTitle={setPageTitle}
          pageTitle={pageTitle}
          navigation={navigation}
        />
      </View>
      {/* Word Saved Notification  */}
      {/* <View className="absolute bottom-16 flex flex-row justify-center w-full border border-red-50 ">
        <View className=" mx-4 my-2 ">
          <Text className="text-3xl font-semibold text-white opacity-50">
            Word Saved
          </Text>
        </View>
      </View> */}
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
