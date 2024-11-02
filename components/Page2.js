import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";

const Page2 = ({ wordItem }) => {
  const [partOfSpeech, setPartOfSpeech] = useState([]);
  console.log(wordItem);
  useEffect(() => {
    wordItem.meanings.map((meaning) => {
      console.log(meaning);
    });
  }, []);

  const chatgptApiKey = process.env.EXPO_PUBLIC_CHATGPT_KEY;
  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  const [response, setResponse] = useState(null);
  // Shared value to track the scale of the image

  const sendMsg = async () => {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: "use the word" + wordItem.id + "and make a conversation of two people. within each dialouge seperate it with ~",
        },
      ],
    });
    console.log(completion.choices[0].message.content);
    setResponse(completion.choices[0].message.content);
  };

  return (
    <View className="bg-white w-full pt-20 h-full">
      <TouchableOpacity onPress={sendMsg}>
        <Text>Send Hello</Text>
        <Text>{response}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page2;
