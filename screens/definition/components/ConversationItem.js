import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import { ScrollView } from "react-native-gesture-handler";
import { RefreshCcw } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";

export const IniLoadingAnimation = () => {
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
    <View className="flex flex-row   items-center px-2 ">
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
        <View
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          key={index}
          style={[
            {
              alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
              // backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginVertical: 6,
              maxWidth: "75%",
              backgroundColor: index % 2 === 0 ? "#545861" : "#f65827",
            },
            index % 2 === 0
              ? {
                  borderBottomLeftRadius: 0,
                }
              : {
                  borderBottomRightRadius: 0,
                },
          ]}
        >
          <LoadingAnimation />
        </View>
      ) : (
        <View
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          key={index}
          style={[
            {
              alignSelf: index % 2 === 0 ? "flex-start" : "flex-end",
              // backgroundColor: index % 2 === 0 ? "#E0E0E0" : "#007AFF",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 15,
              marginVertical: 6,
              maxWidth: "75%",
              backgroundColor: index % 2 === 0 ? "#545861" : "#f65827",
            },
            index % 2 === 0
              ? {
                  borderBottomLeftRadius: 0,
                }
              : {
                  borderBottomRightRadius: 0,
                },
          ]}
        >
          <Text
            style={{
              color: "#FFFFFF",
              opacity: 0.8,
              fontSize: 14,
            }}
          >
            {line}
          </Text>
        </View>
      )}
    </>
  );
};

export default ConversationItem;
