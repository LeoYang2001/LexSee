import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { ChevronLeft } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import languageCodes from "../../constants";
import { setUserProfile } from "../../slices/userInfoSlice";

const LanguageSelectionScreen = ({ navigation }) => {
  const selectedLanguage = useSelector(
    (state) => state.userInfo.profile.selectedLanguage
  );
  const userProfile = useSelector((state) => state.userInfo.profile);
  const availableLanguages = Object.keys(languageCodes);
  const dispatch = useDispatch();

  return (
    <View
      style={{ backgroundColor: "#15181E" }}
      className="h-full w-full pt-16 flex flex-col"
    >
      <View className="z-20 flex flex-row items-center  justify-between">
        <TouchableOpacity
          className="p-2"
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ChevronLeft color={"#fff"} />
        </TouchableOpacity>
      </View>
      <ScrollView className="w-full flex-1">
        {availableLanguages.map((languageOption) => {
          const lanItem = languageCodes[languageOption];
          const ifCurSelected = languageOption === selectedLanguage;
          if (ifCurSelected) {
            return (
              <View
                key={languageOption}
                className="p-3 flex justify-center items-center"
              >
                <Text
                  style={{
                    color: "#FA541C",
                  }}
                  className="text-3xl  font-bold"
                >
                  {lanItem}
                </Text>
              </View>
            );
          } else {
            return (
              <TouchableOpacity
                onPress={() => {
                  const updatedProfile = {
                    ...userProfile,
                    selectedLanguage: languageOption,
                  };
                  dispatch(setUserProfile(updatedProfile));
                }}
                className="p-3 flex justify-center items-center"
              >
                <Text className="text-xl text-white font-semibold">
                  {lanItem}
                </Text>
              </TouchableOpacity>
            );
          }
        })}
      </ScrollView>
    </View>
  );
};

export default LanguageSelectionScreen;
