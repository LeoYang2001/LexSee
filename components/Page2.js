import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { ScrollView } from "react-native-gesture-handler";
import { RefreshCcw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const LoadingAnimation = () => {
  const [colorArr, setColorArr] = useState([
    "#D3D3D3", // Light Gray
    "#A9A9A9", // Gray
    "#707070", // Dark Gray
    "#505050", // Very Dark Gray
  ]);

  const dotSize = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setColorArr((prevArr) => {
        // Rotate the array by moving the last element to the front
        const newArr = [...prevArr];
        const lastElement = newArr.pop();
        newArr.unshift(lastElement);
        return newArr;
      });
    }, 200); // Rotate every 1000ms (1 second)

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex flex-row  items-center px-2 ">
      {colorArr.slice(0, 3).map((color) => (
        <View
          key={color}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize,
            backgroundColor: color,
            marginRight: 2,
          }}
        />
      ))}
    </View>
  );
};

const IniLoadingAnimation = () => {
  const [colorArr, setColorArr] = useState([
    "#D3D3D3", // Light Gray
    "#A9A9A9", // Gray
    "#707070", // Dark Gray
    "#505050", // Very Dark Gray
  ]);

  const dotSize = 7;

  useEffect(() => {
    const timer = setInterval(() => {
      setColorArr((prevArr) => {
        // Rotate the array by moving the last element to the front
        const newArr = [...prevArr];
        const lastElement = newArr.pop();
        newArr.unshift(lastElement);
        return newArr;
      });
    }, 200); // Rotate every 1000ms (1 second)

    // Clear the interval when the component unmounts
    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex flex-row  items-center px-2 ">
      {colorArr.slice(0, 3).map((color) => (
        <View
          key={color}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize,
            backgroundColor: color,
            marginRight: 2,
          }}
        />
      ))}
    </View>
  );
};

const ConversationItem = ({ line, index, pushConversation }) => {
  const timeFactor = 200 + line.length * 15;

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);

      pushConversation();
    }, timeFactor);

    return () => clearTimeout(timer);
  }, []);

  //timeout item,  once time is up, loading becomes
  // the actual conversation and we gonna the call function to
  //reveal next conversationItem
  return (
    <>
      {isLoading ? (
        <LinearGradient
          colors={
            index % 2 === 0 ? ["#1b1920", "#1b1920"] : ["#6D60F3ff", "#c34af4"]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          key={index}
          style={{
            alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
            // backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
            padding: 10,
            borderRadius: 15,
            marginVertical: 5,
            maxWidth: "75%",
          }}
        >
          <LoadingAnimation />
        </LinearGradient>
      ) : (
        <LinearGradient
          colors={
            index % 2 === 0 ? ["#1b1920", "#1b1920"] : ["#6D60F3ff", "#c34af4"]
          }
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          key={index}
          style={{
            alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
            // backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
            padding: 10,
            borderRadius: 15,
            marginVertical: 5,
            maxWidth: "75%",
          }}
        >
          <Text
            style={{
              color: index % 2 === 0 ? "#fff" : "#000",
              fontSize: 16,
            }}
          >
            {line}
          </Text>
        </LinearGradient>
      )}
    </>
  );
};

const Page2 = ({ wordItem, selectedDefinition, activePage }) => {
  const { id, phonetics } = wordItem;
  const [conversation, setConversation] = useState([]);
  const [displayedConversation, setDisplayedConversation] = useState([]);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (activePage === 1) {
      createConversation(selectedDefinition);
    } else {
      resetDisplayedConversation();
    }
  }, [selectedDefinition, activePage]);

  useEffect(() => {
    if (conversation.length > 0) {
      pushConversation();
    }
  }, [conversation]);

  useEffect(() => {
    setDisplayedConversation(conversation.slice(0, displayedIndex));
  }, [displayedIndex]);

  const chatgptApiKey = process.env.EXPO_PUBLIC_CHATGPT_KEY;
  const openai = new OpenAI({
    apiKey: chatgptApiKey,
  });

  const pushConversation = () => {
    console.log("push conve");
    console.log(conversation.length);
    if (displayedIndex < conversation.length) {
      console.log(displayedIndex);
      setDisplayedIndex((prevIndex) => prevIndex + 1);
    }
  };

  const resetDisplayedConversation = () => {
    console.log("reset");
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
    console.log("got conversation from gpt");
    console.log(displayedConversation);
    console.log(displayedIndex);
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

  return (
    <LinearGradient
      colors={["#000", "#0D0F1fff"]}
      className="flex-1 w-full  pt-24 px-6"
    >
      <View className="flex flex-row justify-between items-center mb-4">
        <View>
          <Text className="font-semibold text-2xl text-white">{id}</Text>
          <Text className="text-sm text-gray-300">{phonetics.text}</Text>
        </View>
        <TouchableOpacity
          disabled={displayedConversation.length != conversation.length}
          className="p-3 self-center"
          onPress={() => {
            createConversation();
            setDisplayedIndex(0);
          }}
        >
          <RefreshCcw
            color={
              displayedConversation.length != conversation.length
                ? "#333"
                : "white"
            }
          />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <LinearGradient
          colors={true ? ["#1b1920", "#1b1920"] : ["#6D60F3ff", "#c34af4"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{
            alignSelf: true ? "flex-start" : "flex-end",
            // backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
            padding: 10,
            borderRadius: 15,
            marginVertical: 5,
            maxWidth: "75%",
          }}
        >
          <IniLoadingAnimation />
        </LinearGradient>
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
    </LinearGradient>
  );
};

export default Page2;
