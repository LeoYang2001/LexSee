import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { auth } from "../../../firebase";

const ProfileSetupSheet = () => {
  const bottomSheetRef = useRef(null);
  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);
  const { displayName, photoURL, email } = auth?.currentUser;
  const [updateName, setUpdateName] = useState("");

  return (
    <View className="w-full h-full bg-transparent">
      <BottomSheet
        snapPoints={["99%"]}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        handleComponent={null}
        style={{
          backgroundColor: "transparent",
        }}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View className="w-full h-full bg-transparent  py-6 items-center flex flex-col">
            <Text
              style={{
                fontSize: 18,
              }}
              className="text-white opacity-90  mb-3 font-bold"
            >
              Profile Setting
            </Text>
            <View className="w-full flex flex-col  my-3 items-center">
              <TouchableOpacity
                className=" overflow-hidden"
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 60,
                }}
              >
                <Image
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  source={require("./../../../assets/ProfilePicTemplate.png")}
                />
              </TouchableOpacity>
              <Text
                className="text-white opacity-50 mt-5"
                style={{
                  fontSize: 18,
                }}
              >
                {email}
              </Text>
            </View>
            <View className="w-full px-6 flex flex-col  mt-3">
              <Text className="text-white opacity-70 my-2">Name </Text>
              <TextInput
                className="w-full text-white text-lg  text-center"
                style={{
                  height: 50,
                  backgroundColor: "#30343a",
                  borderRadius: 12,
                }}
                value={updateName}
                onChangeText={setUpdateName}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#191D24",
    borderRadius: 14,
    padding: 0,
  },
});

export default ProfileSetupSheet;
