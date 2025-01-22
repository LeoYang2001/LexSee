// Loading.js
import React from "react";
import { useSelector } from "react-redux";

const MyLoading = () => {
  const isLoading = useSelector((state) => state.loading.isLoading);

  if (!isLoading) return null;

  return (
    <View
      className="border w-full h-full bg-red-500"
      style={{
        zIndex: 3000,
      }}
    >
      <Text className="text-red-500 text-3xl absolute font-bold ">loading</Text>
    </View>
  );
};

export default MyLoading;
