import { View, Text } from "react-native";
import React from "react";

const WordFlexCard = () => {
  return (
    <View
      style={{
        height: 132,
        borderRadius: 12,
      }}
      className="w-full flex flex-col  border p-4"
    >
      <View className="w-full border">
        <Text className="font-semibold" style={{ fontSize: 24 }}>
          Explore
        </Text>
      </View>
    </View>
  );
};

export default WordFlexCard;
