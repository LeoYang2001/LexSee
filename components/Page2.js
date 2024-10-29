import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const Page2 = ({ wordItem }) => {
  const [response, setResponse] = useState(null);
  // Shared value to track the scale of the image
  return (
    <View className="bg-white w-full h-full">
      <TouchableOpacity>
        <Text>Send Hello</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Page2;
