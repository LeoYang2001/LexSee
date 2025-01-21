import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Bookmark } from "lucide-react-native";

const SaveBtn = ({ ifSaved }) => {
  console.log("ifSaved:", ifSaved);

  return ifSaved ? (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#3f3339",
      }}
      className="flex justify-center items-center"
    >
      <Bookmark color={"#d1461e"} fill={"#d1461e"} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#39404e",
      }}
      className="flex justify-center items-center"
    >
      <Bookmark color={"#66686b"} fill={"#66686b"} />
    </TouchableOpacity>
  );
};

export default SaveBtn;
