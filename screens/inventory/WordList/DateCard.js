import React from "react";
import { Text, View } from "react-native";

const DateCard = ({ date }) => {
  return (
    <View className="px-3 pt-4">
      <Text style={{ fontSize: 12, opacity: 0.6 }} className="text-white">
        {date}
      </Text>
    </View>
  );
};

export default DateCard;
