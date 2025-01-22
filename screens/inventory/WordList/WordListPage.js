import {
  ArrowRight,
  ChevronDown,
  Triangle,
  Volume2,
} from "lucide-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import WordCard from "./WordCard";
import DateCard from "./DateCard";

const WordListPage = () => {
  return (
    <View>
      {/*Sort*/}
      <View
        style={{ width: "100%", height: 58 }}
        className="justify-around items-center flex flex-row"
      >
        <TouchableOpacity className="flex flex-row flex-1 justify-center items-center">
          <Text style={{ fontSize: 14, opacity: 0.7 }} className="text-white">
            Descending time
          </Text>
          <ChevronDown color="white" size={10} />
        </TouchableOpacity>
        <TouchableOpacity className="flex flex-row flex-1 justify-center items-center">
          <Text style={{ fontSize: 14, opacity: 0.7 }} className="text-white">
            Graphics context
          </Text>
          <ChevronDown color="white" size={10} />
        </TouchableOpacity>
      </View>
      {/*date*/}
      <DateCard date="2024/12/08"> </DateCard>
      {/*Card*/}
      <WordCard word="Bluff" pronunciation="/blʌf/" />
      <WordCard word="Infant" pronunciation="/ɪkˈsplɔː(r)/" />
      <DateCard date="2024/12/08"> </DateCard>
      <WordCard word="Bluff" pronunciation="/blʌf/" />
      <DateCard date="2024/12/08"> </DateCard>
      <WordCard word="Infant" pronunciation="/ɪkˈsplɔː(r)/" />
    </View>
  );
};

export default WordListPage;
