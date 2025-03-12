import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { Volume2 } from "lucide-react-native";
import Constants from "expo-constants";
import ConversationItem, {
  IniLoadingAnimation,
} from "../components/ConversationItem";
import SaveBtn from "../components/SaveBtn";
import { LinearGradient } from "expo-linear-gradient";
import { fetchConversation } from "../../../gptFunctions";
import languageCodes from "../../../constants";
import { useSelector } from "react-redux";
import PronunciationButton from "../../../components-shared/PronunciationButton";

const ConversationPage = ({
  wordItem,
  ifSaved,
  imgPlaceHolderUrl,
  designatedConvDef,
}) => {
  //SelectedLanguage
  const selectedLanguage = useSelector(
    (state) => state.userInfo.profile.selectedLanguage
  );
  //   ******* FROM VERSION 1 ******
  const [conversation, setConversation] = useState([]);
  const [displayedConversation, setDisplayedConversation] = useState([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ifGenerate, setIfGenerate] = useState(false);

  useEffect(() => {
    console.log("designatedConvDef:", designatedConvDef); // todo: remove
    if (!designatedConvDef) {
      if (ifGenerate) {
        createConversation();
      }
    } else {
      if (conversation) {
        resetDisplayedConversation();
      }
      createConversation((definition = designatedConvDef));
      setIfGenerate(true);
    }
  }, [designatedConvDef]);

  useEffect(() => {
    if (conversation.length === 0) {
      createConversation((definition = designatedConvDef));
    }
  }, [setIfGenerate]); //todo: yo leo, I know this fixes the bug but idk why and it's 2am rn so Ima sleep

  useEffect(() => {
    if (conversation.length > 0) {
      pushConversation();
    }
  }, [conversation]);
  useEffect(() => {
    setDisplayedConversation(conversation.slice(0, displayedIndex));
  }, [displayedIndex]);

  const chatgptApiKey =
    Constants.expoConfig.extra.chatgptApiKey ||
    process.env.EXPO_DOT_CHATGPT_KEY;

  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  const pushConversation = () => {
    if (displayedIndex < conversation.length) {
      setDisplayedIndex((prevIndex) => prevIndex + 1);
    }
  };

  const resetDisplayedConversation = () => {
    setDisplayedConversation([]);
    setDisplayedIndex(0);
  };

  // Shared value to track the scale of the image

  const createConversation = async (definition = null) => {
    if (definition) {
      console.log("generating by definition:", definition);
    }

    setIsLoading(true);

    const timeout = new Promise(
      (_, reject) =>
        setTimeout(() => reject("Timeout: Fetch took too long"), 10000) // 10 seconds
    );
    let conversationLines = [];
    try {
      conversationLines = await Promise.race([
        fetchConversation(
          openai,
          wordItem.id,
          languageCodes[selectedLanguage],
          definition
        ),
        timeout,
      ]);
    } catch (error) {
      if (error === "Timeout: Fetch took too long") {
        alert("Fetch failed, please check your internet connection");
        setIfGenerate(false);
        resetDisplayedConversation();
      } else {
        console.error("Error during fetch:", error);
      }
    } finally {
      setIsLoading(false);
      setConversation(conversationLines);
    }
  };

  //   ******* FROM VERSION 1 ******

  return (
    <LinearGradient
      colors={["#242c3c", "#1d1f24"]}
      style={{
        borderRadius: 16,
      }}
      className="w-full h-full "
    >
      <View className="w-full h-full py-8 px-5 flex  flex-col  gap-y-4">
        <View className="w-full flex flex-row justify-between  items-center">
          <View>
            <Text
              className="font-semibold"
              style={{ fontSize: 28, color: "#fff" }}
            >
              {wordItem?.id}
            </Text>
            <PronunciationButton
              word={wordItem.id}
              phonetics={wordItem.phonetics}
              size={20}
            />
          </View>
          <SaveBtn
            wordItem={wordItem}
            imgUrl={imgPlaceHolderUrl}
            ifSaved={ifSaved}
          />
        </View>
        <View className=" flex flex-row ">
          {wordItem.meanings.map((meaning, index) => (
            <TouchableOpacity
              style={{
                height: 20,
                backgroundColor: "#ffffff1E",
                borderRadius: 2,
              }}
              className="px-1 mr-2 flex justify-center items-center"
              key={index}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                  opacity: 0.7,
                }}
              >
                {meaning.partOfSpeech}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* CONVERSATION GEN  */}

        {ifGenerate ? (
          <View className="flex-1 w-full ">
            <ScrollView
              showsVerticalScrollIndicator={false}
              className="  flex-1   "
            >
              {isLoading ? (
                <View
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={[
                    {
                      alignSelf: true ? "flex-start" : "flex-end",
                      // backgroundColor: true ? "#E0E0E0" : "#007AFF",
                      paddingVertical: 10,
                      paddingHorizontal: 20,
                      borderRadius: 15,
                      marginVertical: 6,
                      maxWidth: "75%",
                      backgroundColor: "#545861",
                      borderBottomLeftRadius: 0,
                    },
                  ]}
                >
                  <IniLoadingAnimation />
                </View>
              ) : (
                <>
                  {/* Display each line in the conversation array in a text-message style */}
                  {displayedConversation.map((line, index) => (
                    <ConversationItem
                      pushConversation={pushConversation}
                      key={index}
                      line={line}
                      index={index}
                      highlightWord={wordItem?.id}
                    />
                  ))}
                </>
              )}
            </ScrollView>
            <TouchableOpacity
              disabled={displayedConversation.length != conversation.length}
              className="p-3 self-center mt-auto w-full flex justify-center items-center"
              style={{
                backgroundColor: "#FA541C",
                borderRadius: 9,
              }}
              onPress={() => {
                resetDisplayedConversation();
                createConversation((definition = designatedConvDef));
              }}
            >
              <Text
                style={{ fontSize: 15 }}
                className="text-white font-semibold"
              >
                Regenerate
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full  flex-1 flex-col items-center justify-center">
            <Image
              style={{ width: 62, height: 62 }}
              source={require("../../../assets/conGeneration.png")}
            />
            <Text
              className="text-white opacity-40 font-bold"
              style={{
                fontSize: 18,
              }}
            >
              No conversation yet
            </Text>
            <TouchableOpacity
              disabled={displayedConversation.length != conversation.length}
              className="  px-4 py-1 mt-6 flex justify-center items-center"
              style={{
                backgroundColor: "#FA541C",
                borderRadius: 9,
              }}
              onPress={() => {
                setIfGenerate(true);
              }}
            >
              <Text
                style={{ fontSize: 15 }}
                className="text-white font-semibold"
              >
                Generate
              </Text>
            </TouchableOpacity>
            {/* PADDING FIX  */}
            <View className=" h-10 mt-18 border w-10 bg-red-50 opacity-0 " />
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

export default ConversationPage;
