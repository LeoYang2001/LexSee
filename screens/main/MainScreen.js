import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Search } from "lucide-react-native";

import Logo from "../../components-shared/Logo";
import InventoryStatistic from "./components/InventoryStatistic";
import WordFlexCard from "../../components-shared/WordFlexCard";
import { useSelector } from "react-redux";

// Word suggestion API = https://api.datamuse.com/sug?s=d&max=40

const MainScreen = ({ navigation }) => {
  //Active flexCard Id
  const [activeCardId, setActiveCardId] = useState(null);

  const savedWordsFromStore = useSelector((state) => {
    try {
      return JSON.parse(state.userInfo.savedWordList); // Parse the stringified word list
    } catch (error) {
      console.log("Error parsing savedWordList:", error);
      return [];
    }
  });

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setActiveCardId(null);
      }}
    >
      <View
        style={{
          backgroundColor: "#181d24",
        }}
        className="flex-1   flex flex-col  p-4 pt-16"
      >
        {/* HEADER */}
        <View
          style={{ height: 58 }}
          className="w-full  flex-row justify-between items-center"
        >
          <View>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
              }}
              className="font-semibold z-30"
            >
              LexSee
            </Text>
            <View className=" absolute self-center top-3">
              <Logo size={22} />
            </View>
          </View>
          <View className="flex flex-row gap-4 items-center">
            <TouchableOpacity className=" flex flex-row   items-center justify-center">
              <Text
                style={{
                  opacity: 0.7,
                  color: "#FFFFFF",
                }}
                className=" mr-2"
              >
                English
              </Text>
              <View
                style={{
                  width: 0,
                  height: 0,
                  borderLeftWidth: 6, // Adjust for size
                  borderRightWidth: 6, // Adjust for size
                  borderTopWidth: 7, // Adjust for size
                  borderLeftColor: "transparent",
                  borderRightColor: "transparent",
                  borderTopColor: "#C9CDD4",
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}
              className=" flex flex-col gap-1 p-3 "
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#fff",
                  width: 18,
                  borderRadius: 1,
                }}
              />
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#fff",
                  width: 18,
                  borderRadius: 1,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* Search Input  */}
        <TouchableOpacity
          style={{
            height: 49,
            backgroundColor: "#3d3f44",
            borderRadius: 12,
          }}
          className={`w-full relative z-20  mt-8  `}
          onPress={() => {
            navigation.navigate("WordSearch");
          }}
        >
          <View className=" h-full pl-4 flex flex-row items-center">
            <Search color={"#ffffffc0"} size={20} />
          </View>
        </TouchableOpacity>
        {/* Inventory Statistic  */}
        <View className="mt-8">
          <InventoryStatistic />
        </View>
        <View
          style={{
            opacity: 1,
          }}
          className=" mt-8 flex-1 "
        >
          {/* Filter  */}
          <View className="w-full  mb-4 flex flex-row justify-between">
            <Text
              style={{
                fontSize: 12,
                color: "#fff",
                opacity: 0.7,
              }}
            >
              Recently Pinned
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: "#fff",
                opacity: 0.7,
              }}
            >
              All
            </Text>
          </View>
          <ScrollView>
            {savedWordsFromStore.length > 0 &&
              savedWordsFromStore.map((word) => (
                <WordFlexCard
                  navigation={navigation}
                  ifActive={activeCardId === word.id}
                  setActiveCardId={setActiveCardId}
                  wordItem={word}
                  key={word.id}
                />
              ))}
          </ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MainScreen;
