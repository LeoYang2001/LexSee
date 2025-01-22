import React from "react";
import { View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowRight, Volume2 } from "lucide-react-native";

const WordCard = ({ word, pronunciation }) => {
  return (
    <View className="px-3 pt-4">
      <View className="w-full h-20 rounded-lg overflow-hidden">
        <LinearGradient
          colors={["#23272F", "#242424"]}
          style={{ flex: 1 }}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View className="flex flex-row justify-between items-center pr-2 pl-5 h-full">
            <View className="flex justify-between h-full py-3.5">
              <Text
                style={{ opacity: 0.8, fontSize: 20 }}
                className="text-white font-semibold"
              >
                {word}
              </Text>
              <View className="flex flex-row items-center space-x-2">
                <Text style={{ opacity: 0.5, fontSize: 14, color: "#FFFFFF" }}>
                  {pronunciation}
                </Text>
                <Volume2
                  className="mx-1"
                  color="white"
                  opacity={0.7}
                  size={12}
                />
              </View>
            </View>
            <TouchableOpacity className="justify-center">
              <ArrowRight color="white" opacity={0.8} size={22} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </View>
  );
};

export default WordCard;
