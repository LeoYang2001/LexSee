import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import OpenAI from "openai";
import { definitionReturnExample } from "../constants";
import PronunciationButton from "../components/PronunciationButton";
import ImageGallery from "../components/ImageGallery";
import Meaning from "../components/Meanings";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { ArrowDownToLine, ChevronLeft } from "lucide-react-native";
import SwipeCardsScreen from "./SwipeCardsScreen";
import SaveWordPopup from "../components/SaveWordPopup";

const DefinitionScreen = ({ navigation, route }) => {
  const iniWord = route.params.searchedWord;
  const [searchedWord, setSearchedWord] = useState(iniWord);
  const [definition, setDefinition] = useState(null);
  const [imagesResults, setimagesResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To know if there are more images to load
  const [isLoadingDef, setIsLoadingDef] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  //divide the response into different parts
  const [phonetics, setPhonetics] = useState(null);
  const [meanings, setMeanings] = useState(null);

  const [ifPopUpWin, setIfPopUpWin] = useState(false);

  const Card1 = () => {
    return (
      <View className="flex-1 flex   w-full relative">
        {meanings && !isLoadingDef ? (
          <Meaning
            searchNewWord={searchNewWord}
            phonetics={phonetics}
            searchedWord={searchedWord}
            meanings={meanings}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator />
          </View>
        )}
      </View>
    );
  };

  const Card2 = () => {
    return (
      <View className="flex-1 w-full  relative">
        {imagesResults.length > 0 ? (
          <ImageGallery
            onSaveWord={handleSavingWord}
            images_result={imagesResults}
            fetchMoreImages={fetchMoreImages}
            page={page}
          />
        ) : (
          <Text>Searching images...</Text>
        )}
      </View>
    );
  };

  const handleSavingWord = async ({ imgUrl }) => {
    if (!searchedWord || !meanings) return;

    setIsSaving(true);
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const wordData = {
        phonetics: phonetics,
        meanings: meanings,
        imgUrl: imgUrl,
        timeStamp: new Date().toISOString(),
      };

      try {
        await setDoc(
          doc(db, "users", userId, "wordList", searchedWord),
          wordData
        );
        console.log("Word saved successfully!");
        setIsSaving(false);
        navigation.navigate("WordList");
      } catch (error) {
        console.error("Error saving word:", error);
      }
    }
  };

  const handleInputImgUrl = () => {
    //pop window for user to input imgUrl
    setIfPopUpWin(true);
  };

  const inputRef = useRef(null);

  const CHATGPT_KEY =
    "sk-proj-zla7u7ibGnm71qylVqb1T3BlbkFJbrzU9Yj0SvhpnPK6T9zl";
  const openai = new OpenAI({
    apiKey: CHATGPT_KEY,
    dangerouslyAllowBrowser: true,
  });

  //Filter the phonetic value
  function getObjectWithAudio(arr) {
    // Check for the first object with a non-empty audio property
    const objWithAudio = arr.find(
      (item) => item.audio && item.audio.trim() !== ""
    );

    // If found, return that object, otherwise return the first object in the array
    return objWithAudio || arr[0];
  }

  //Update each part once the definition has been updated
  useEffect(() => {
    if (definition?.meanings) {
      setMeanings(definition.meanings);
    }
    if (definition?.phonetics) {
      const phoneticVal = getObjectWithAudio(definition.phonetics);
      setPhonetics(phoneticVal);
    }
  }, [definition]);

  const searchNewWord = (word) => {
    navigation.replace("Definition", {
      searchedWord: word,
    });
  };

  //Alternative way to fetchWord, implementing openai api
  const fetchWordDefinitionFromAi = async (word) => {
    setIsLoadingDef(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an English teacher." },
          {
            role: "user",
            content: `define word ${word}. return me in this format ${JSON.stringify(
              definitionReturnExample
            )}`,
          },
        ],
        model: "gpt-4o-mini",
      });

      const response = completion.choices[0].message.content;
      console.log("OpenAI Response:", response); // Debugging line

      // Attempt to clean the response if necessary
      const cleanedResponse = response.trim();

      console.log("cleanedResponse.meanings");
      setMeanings(JSON.parse(cleanedResponse).meanings);
    } catch (error) {
      console.error("Error in handleAISearch:", error);
    } finally {
      setIsLoadingDef(false); // Ensure loading state is reset
    }
  };

  const fetchWordDefinition = async () => {
    setIsLoadingDef(true);
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${searchedWord}`
    );
    const rs = await res.json();
    if (rs.length > 0) {
      setDefinition(rs[0]);
      setIsLoadingDef(false);
    } else {
      fetchWordDefinitionFromAi(searchedWord);
    }
  };

  const handleSearchImage = async (urlWord, newPage = 1) => {
    console.log("fetching images...", newPage);
    // setIsLoadingPic(true);

    try {
      const apiKey = "AIzaSyBTVL3kl1d0u7sg0h9VjYsiQtot58DPwQ0";
      const cx = "2121e0d2556664ff3";
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${urlWord}&cx=${cx}&searchType=image&key=${apiKey}&start=${
          (newPage - 1) * 10 + 1
        }`
      );
      const data = await response.json();
      if (data.items) {
        // Append new images to the current list
        setimagesResults((prevImages) => [...prevImages, ...data.items]);
        console.log(imagesResults.length);
        // Set `hasMore` to `false` if fewer items are returned than requested (indicating end of results)
        setHasMore(data.items.length === 10);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching images:", error);
      setHasMore(false);
    } finally {
    }
  };

  const fetchMoreImages = () => {
    if (hasMore) {
      handleSearchImage(searchedWord, page + 1);
    }
  };

  useEffect(() => {
    fetchWordDefinition();
    handleSearchImage(searchedWord);
  }, [searchedWord]);

  return (
    <SafeAreaView className="flex-1 relative overflow-hidden">
      {ifPopUpWin && (
        <SaveWordPopup
          isSaving={isSaving}
          handleSavingWord={handleSavingWord}
          setIfPopUpWin={setIfPopUpWin}
        />
      )}
      <View className="flex-1 px-10 py-10">
        {/* HEADER */}
        <View className="w-full flex-row justify-between">
          <TouchableOpacity
            className="p-3 flex justify-center rounded-xl bg-white items-center"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeft size={24} color={"black"} />
          </TouchableOpacity>
          <TouchableOpacity
            className="p-3 flex justify-center rounded-xl bg-white items-center"
            onPress={handleInputImgUrl}
          >
            <ArrowDownToLine size={24} color={"black"} />
          </TouchableOpacity>
        </View>

        <View className=" flex-row justify-between mb-10"></View>
        <SwipeCardsScreen
          card1={Card1} // Passing Card1 as a component
          card2={Card2} // Passing Card2 as a component
        />
      </View>
    </SafeAreaView>
  );
};

export default DefinitionScreen;
