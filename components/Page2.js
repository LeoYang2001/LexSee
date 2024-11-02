import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { ScrollView } from "react-native-gesture-handler";
import { RefreshCcw } from "lucide-react-native";

const Page2 = ({ wordItem }) => {
  const { id, meanings, phonetics } = wordItem;
  const [conversation, setConversation] = useState([]);

  console.log(wordItem);
  useEffect(() => {
    wordItem.meanings.map((meaning) => {
      console.log(meaning);
    });
    createConversation();
  }, []);

  const chatgptApiKey = process.env.EXPO_PUBLIC_CHATGPT_KEY;
  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  // Shared value to track the scale of the image

  const createConversation = async (definition = null) => {
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
    console.log(responseText);

    // Split response by newline and remove empty lines, then set as conversation array
    const conversationLines = responseText
      .split("\n")
      .filter(
        (line) => line.trim().startsWith("~") && line.trim().endsWith("~")
      )
      .map((line) => line.trim().slice(1, -1)); // Removes the first and last character (~) from each line

    setConversation(conversationLines);
  };

  return (
    <View className="bg-black w-full h-full pt-20 px-4 border-red-400 border">
      <View className="flex flex-row justify-between items-center">
        <View>
          <Text className="font-semibold text-3xl text-white">{id}</Text>
          <Text className="text-sm text-gray-300">{phonetics.text}</Text>
        </View>
        <TouchableOpacity
          className="p-3 self-center"
          onPress={() => createConversation()}
        >
          <RefreshCcw color="white" />
        </TouchableOpacity>
      </View>

      {/* Display each line in the conversation array in a text-message style */}
      {conversation.map((line, index) => (
        <View
          key={index}
          style={{
            alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
            backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
            padding: 10,
            borderRadius: 15,
            marginVertical: 5,
            maxWidth: "75%",
          }}
        >
          <Text
            style={{
              color: index % 2 === 0 ? "#000" : "#fff",
              fontSize: 16,
            }}
          >
            {line}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default Page2;
