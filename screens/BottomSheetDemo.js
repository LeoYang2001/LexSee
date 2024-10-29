import { View, Text, TouchableOpacity } from "react-native";
import React, { useRef } from "react";
import MyBottomSheet from "./MyBottomSheet";

const BottomSheetDemo = () => {
  const bottomSheetRef = useRef(null);

  const handleCurrentIndex = (index) => {
    console.log(index);
  };

  const ScreenComponent = ({ bottomSheetRef }) => {
    return (
      <View className=" flex-1 pt-20">
        <Text>Custom Screen Content</Text>
        <Text>Press the button below to open the sheet.</Text>
        <TouchableOpacity
          onPress={() => {
            if (bottomSheetRef) {
              bottomSheetRef.current.snapTo(1);
            }
          }}
        >
          <Text>Open Sheet</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const bottomSheetConfig = {
    iniIndex: 1,
    snapPoints: [0, 0.5, 1],
    slideDuration: 300,
    ifHideHandleBar: true,
    bottomSheetViewStyle: {},
    handleCurrentIndex,
  };
  return (
    <View className="flex-1 relative w-full pt-14 ">
      <MyBottomSheet
        ref={bottomSheetRef}
        bottomSheetConfig={bottomSheetConfig}
        screenComponent={(props) => (
          <ScreenComponent {...props} bottomSheetRef={bottomSheetRef} />
        )}
        bottomSheetComponent={(props) => (
          <View className="w-full h-full ">
            <Text>demo</Text>
          </View>
        )}
      />
    </View>
  );
};

export default BottomSheetDemo;
