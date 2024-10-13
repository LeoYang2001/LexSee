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
  const [imagesResult, setImagesResults] = useState([]);
  const [isLoadingDef, setIsLoadingDef] = useState(false);
  const [isLoadingPic, setIsLoadingPic] = useState(false);
  const [searchBarWord, setSearchBarWord] = useState("");
  //divide the response into different parts
  const [phonetics, setPhonetics] = useState(null);
  const [meanings, setMeanings] = useState(null);

  const [ifPopUpWin, setIfPopUpWin] = useState(false);

  const Card1 = () => {
    return (
      <View className="flex-1 flex   relative">
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
        {imagesResult.length > 0 && !isLoadingPic ? (
          <ImageGallery
            onSaveWord={handleSavingWord}
            images_result={imagesResult}
          />
        ) : (
          <Text>Searching images...</Text>
        )}
      </View>
    );
  };

  const handleSavingWord = async ({ imgUrl }) => {
    console.log("imgUrl:");
    console.log(imgUrl);
    if (!searchedWord || !meanings) return;

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
  const IMAGE_SEARCH_KEY =
    "8373e03e0067b60c26b44b27fd691f5d311507ad2b344d3943873335bdee7511";

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

  const handleSearchImage = async (urlWord) => {
    setIsLoadingPic(true);
    //find an alternative api
    // return
    try {
      const response = await fetch(
        `https://serpapi.com/search.json?engine=google_images&q=${urlWord}&api_key=${IMAGE_SEARCH_KEY}`
      );
      const data = await response.json();
      if (data?.images_results) {
        // setImagesResults(data?.images_results)
        setImagesResults(data.images_results);
        setIsLoadingPic(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWordDefinition();
    handleSearchImage(searchedWord);
  }, [searchedWord]);

  const handleSearch = () => {
    if (searchBarWord.trim()) {
      setSearchedWord(searchBarWord);
      setSearchBarWord("");
      if (inputRef?.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 relative overflow-hidden">
      {ifPopUpWin && (
        <SaveWordPopup
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
