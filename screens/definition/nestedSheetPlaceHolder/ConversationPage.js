import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { Bookmark, RefreshCcw, Volume2 } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import ConversationItem, {
  IniLoadingAnimation,
} from "../components/ConversationItem";

const ConversationPage = () => {
  const mockWordItem = {
    id: "culpable",
    imgUrl: "https://cdn.langeek.co/photo/23505/original/?type=jpeg",
    meanings: [
      {
        antonyms: [],
        definitions: [
          "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
        ],
        partOfSpeech: "adjective",
        synonyms: [],
      },
      {
        antonyms: [],
        definitions: [
          "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
        ],
        partOfSpeech: "adjective",
        synonyms: [],
      },
    ],
    phonetics: {
      audio:
        "https://api.dictionaryapi.dev/media/pronunciations/en/culpable-us.mp3",
      license: {
        name: "BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0",
      },
      sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=789670",
      text: "/ˈkʌlpəbəl/",
    },
    timeStamp: "2024-11-03T23:14:17.405Z",
  };

  const selectedDefinition = mockWordItem.meanings[0].definitions;

  //   ******* FROM VERSION 1 ******
  const { id, phonetics } = mockWordItem;
  const [conversation, setConversation] = useState([]);
  const [displayedConversation, setDisplayedConversation] = useState([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    createConversation(selectedDefinition);
  }, []);

  useEffect(() => {
    if (conversation.length > 0) {
      pushConversation();
    }
  }, [conversation]);
  useEffect(() => {
    setDisplayedConversation(conversation.slice(0, displayedIndex));
  }, [displayedIndex]);

  console.log(Constants.expoConfig.extra);

  const chatgptApiKey =
    Constants.expoConfig.extra.chatgptApiKey ||
    process.env.EXPO_DOT_CHATGPT_KEY;

  console.log(`chatgptApiKey : ${chatgptApiKey}`);
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
    setIsLoading(true);
    // Adjust the prompt based on whether a specific definition is provided
    const userPrompt = definition
      ? `Use the word "${id}" and its specific definition: "${definition}" to create a conversation between two people. 
    
Please follow these rules:
- Limit the conversation to a maximum of 8 lines.
- Each line should start and end with the "~" character.
- Do not include any additional characters before or after the "~" symbols.
- Keep the dialogue casual and natural, and use the word "${id}" in a way that reflects the provided definition.

Example format:
~Hey, did you see the movie last night?~
~Yeah, I did! The plot was a bit obscure, though.~
~Yeah, I know what you mean. The director is famous for creating obscure movies.~

Please respond using this format exactly, with no more than 6 lines.`
      : `Use the word "${id}" to create a conversation between two people. 

Please follow these rules:
- Limit the conversation to a maximum of 8 lines.
- Each line should start and end with the "~" character.
- Do not include any additional characters before or after the "~" symbols.
- Keep the dialogue casual and natural, and use the word "${id}" at least once.

Example format:
~Hey, did you see the movie last night?~
~Yeah, I did! The plot was a bit obscure, though.~
~Yeah, I know what you mean. The director is famous for creating obscure movies.~

Please respond using this format exactly, with no more than 6 lines.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: userPrompt },
      ],
    });

    const responseText = completion.choices[0].message.content;
    // Split response by newline and remove empty lines, then set as conversation array
    const conversationLines = responseText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("~") && line.trim().endsWith("~")
      )
      .map((line) => line.trim().slice(1, -1)); // Removes the first and last character (~) from each line

    setConversation(conversationLines);
    setIsLoading(false);
  };

  //   ******* FROM VERSION 1 ******

  return (
    <View className="w-full h-full pt-8 pb4 px-5 flex  flex-col gap-4 ">
      <View className="w-full flex flex-row justify-between  items-center">
        <View>
          <Text
            className="font-semibold"
            style={{ fontSize: 28, color: "#fff" }}
          >
            {mockWordItem?.id}
          </Text>
          <TouchableOpacity className="py-2 flex flex-row items-center">
            <Text
              style={{
                color: "#FFFFFFB3",
                fontSize: 18,
              }}
            >
              {mockWordItem?.phonetics.text}
            </Text>
            <Volume2 className="ml-2" color={"#FFFFFFB3"} size={18} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: "#3f3339",
          }}
          className="flex justify-center items-center"
        >
          <Bookmark color={"#d1461e"} fill={"#d1461e"} />
        </TouchableOpacity>
      </View>
      <View className=" flex flex-row ">
        {mockWordItem.meanings.map((meaning, index) => (
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
      <View className="  flex-1   ">
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
                backgroundColor: true ? "#545861" : "#f65827",
              },
              true
                ? {
                    borderBottomLeftRadius: 0,
                  }
                : {
                    borderBottomRightRadius: 0,
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
              />
            ))}
          </>
        )}
        <TouchableOpacity
          disabled={displayedConversation.length != conversation.length}
          className="p-3 self-center mt-auto w-full flex justify-center items-center"
          style={{
            backgroundColor: "#49475E",
            borderRadius: 9,
          }}
          onPress={() => {
            createConversation();
            setDisplayedIndex(0);
          }}
        >
          <Text style={{ fontSize: 15 }} className="text-white">
            Regenerate
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConversationPage;
