import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import NestedSheetPlaceHolder from "./nestedSheetPlaceHolder/NestedSheetPlaceHolder";
import { ChevronLeft } from "lucide-react-native";

const DefinitionScreen = ({ navigation }) => {
  const [pageTitle, setPageTitle] = useState("Explanation");

  return (
    <View
      style={{
        backgroundColor: "#121417",
      }}
      className="w-full h-full relative"
    >
      {/* Header  */}
      <View className=" pt-10  flex flex-row items-center px-4 justify-between">
        <TouchableOpacity
          className=" p-2"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            color: "#fff",
            opacity: 0.5,
          }}
          className="text-lg text-red-500  py-4"
        >
          {pageTitle}
        </Text>
        <TouchableOpacity className=" p-2 opacity-0">
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: "86%",
        }}
        className="w-full absolute bottom-0"
      >
        <NestedSheetPlaceHolder
          setPageTitle={setPageTitle}
          pageTitle={pageTitle}
        />
      </View>
    </View>
  );
};

export default DefinitionScreen;
