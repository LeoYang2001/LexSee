import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";

const ConfirmButton = ({
  confirmImg,
  handleConfirmImg,
  handleCancelConfirm,
}) => {
  return (
    <View
      style={{
        width: 333,
        height: 334,
        backgroundColor: "#191D24",
        borderRadius: 15,
        padding: 20,
      }}
      className="flex flex-col justify-between"
    >
      <View
        style={{
          height: 143,
        }}
        className="w-full"
      >
        {confirmImg && (
          <Image
            className="absolute"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: 12,
            }}
            source={{
              uri: confirmImg,
            }}
            resizeMode="cover"
          />
        )}
      </View>
      <View className="w-full flex flex-col  items-start gap-2 ">
        <Text
          className="font-bold text-white opacity-90"
          style={{
            fontSize: 16,
          }}
        >
          Select this picture?
        </Text>
        <Text className=" text-white opacity-70">
          Confirm to use this photo for word memorization? Changes can be made
          later.
        </Text>
      </View>
      <View className="flex flex-row justify-between">
        <TouchableOpacity
          onPress={handleConfirmImg}
          className="px-16 py-4 flex justify-center items-center"
          style={{
            backgroundColor: "#FA541C",
            borderRadius: 9,
          }}
        >
          <Text
            className=" text-white"
            style={{
              fontSize: 15,
            }}
          >
            Confirm
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCancelConfirm}
          className=" flex-1 ml-2 py-4 flex justify-center items-center"
          style={{
            borderRadius: 9,
          }}
        >
          <Text className="text-white">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ConfirmButton;
