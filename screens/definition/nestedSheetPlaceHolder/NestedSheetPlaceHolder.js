import React, { useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import ExpalnationPage from "./ExpalnationPage";

const NestedSheetPlaceHolder = ({ pageTitle, setPageTitle }) => {
  const firstSheetRef = useRef(null);
  const secondSheetRef = useRef(null);

  useEffect(() => {
    if (firstSheetRef?.current) {
      firstSheetRef.current?.present();
    }
  }, [firstSheetRef]);

  // callback to switch sheet
  const handleSwitchSheet = useCallback(() => {
    if (pageTitle === "Explanation") {
      firstSheetRef.current?.close();
      secondSheetRef.current?.present();
      setPageTitle("Conversation");
    } else {
      firstSheetRef.current?.present();
      secondSheetRef.current?.close();
      setPageTitle("Explanation");
    }
  }, [pageTitle]);

  // renders
  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheetModalProvider>
        <View className=" absolute flex justify-center items-center w-full h-full mt-4">
          <TouchableOpacity
            style={{
              width: "93%",
              borderRadius: 14,
              backgroundColor: "#1d2535",
            }}
            className=" h-full  bg-red-500"
            onPress={handleSwitchSheet}
          ></TouchableOpacity>
        </View>

        {/* First Bottom Sheet */}
        <BottomSheetModal
          handleComponent={null}
          ref={firstSheetRef}
          snapPoints={["95%"]}
          enablePanDownToClose={false}
          // onDismiss={handleSwitchSheet}
        >
          <BottomSheetView style={styles.contentContainer}>
            <ExpalnationPage />
          </BottomSheetView>
        </BottomSheetModal>

        {/* Second Bottom Sheet */}
        <BottomSheetModal
          ref={secondSheetRef}
          snapPoints={["95%"]}
          handleComponent={null}
          enablePanDownToClose={false}
          // onDismiss={handleSwitchSheet}
        >
          <BottomSheetView style={styles.contentContainer}></BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121417",
  },
  contentContainer: {
    backgroundColor: "#2c313d",
    borderRadius: 14,
    padding: 0,
    flex: 1,
  },
});

export default NestedSheetPlaceHolder;
