import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { Bookmark, ImageUp, Volume2 } from "lucide-react-native";
import { BlurView } from "expo-blur";
import SaveBtn from "../components/SaveBtn";
import { LinearGradient } from "expo-linear-gradient";
import PronunciationButton from "../../../components-shared/PronunciationButton";

const initialImgPlaceHolderUrl =
  "https://firebasestorage.googleapis.com/v0/b/lexseev2.firebasestorage.app/o/blurryImageGallery.png?alt=media&token=5c84a962-f121-4962-9cb7-d36fcc6d7ca9";

const ExpalnationPage = ({
  wordItem,
  ifSaved,
  navigation,
  imgPlaceHolderUrl,
  handleGenerateConvWithDef,
}) => {
  const ifTemplatePic = imgPlaceHolderUrl === initialImgPlaceHolderUrl;

  return (
    <LinearGradient
      colors={["#242c3c", "#1d1f24"]}
      style={{
        borderRadius: 16,
      }}
      className="w-full h-full"
    >
      <View className="w-full h-full py-8 px-5 flex  flex-col  gap-y-4">
        <View className="w-full flex flex-row justify-between  items-center ">
          <View>
            <Text
              className="font-semibold"
              style={{ fontSize: 28, color: "#fff" }}
            >
              {wordItem?.id}
            </Text>
            <PronunciationButton
              word={wordItem.id}
              phonetics={wordItem.phonetics.text}
              size={20}
            />
          </View>
          <SaveBtn
            wordItem={wordItem}
            imgUrl={imgPlaceHolderUrl}
            ifSaved={ifSaved}
          />
        </View>
        <View className=" flex flex-row ">
          {wordItem.meanings.map((meaning, index) => (
            <TouchableOpacity
              style={{
                height: 20,
                backgroundColor: "#ffffff1E",
                borderRadius: 2,
              }}
              className="px-1 mr-2 flex justify-center items-center"
              key={index}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#fff",
                  opacity: 0.7,
                }}
              >
                {meaning.partOfSpeech}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {wordItem.imgUrl ? (
          <View
            className="w-full"
            style={{
              height: 142,
            }}
          >
            <Image
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
              }}
              source={{
                uri: wordItem.imgUrl,
              }}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View
            style={{
              borderRadius: 10,
              height: 142,
            }}
            className="w-full overflow-hidden "
          >
            <Image
              className="absolute"
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 12,
              }}
              source={{
                uri: imgPlaceHolderUrl,
              }}
              resizeMode="cover"
            />
            {ifTemplatePic ? (
              <BlurView
                className="w-full h-full flex justify-center items-center"
                intensity={40}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: "#E44814",
                  }}
                  className="rounded-full px-2 py-1"
                  onPress={() => {
                    navigation.navigate("ImageGallery", {
                      word: wordItem.id,
                    });
                  }}
                >
                  <Text
                    className="font-semibold"
                    style={{
                      color: "#fff",
                      opacity: 0.9,
                    }}
                  >
                    Choose a picture
                  </Text>
                </TouchableOpacity>
              </BlurView>
            ) : (
              <TouchableOpacity
                style={{
                  width: 40,
                  height: 34,
                  borderTopLeftRadius: 10,
                  borderBottomRightRadius: 10,
                  backgroundColor: "rgba(0,0,0,0.35)",
                }}
                className=" absolute right-0 bottom-0 flex justify-center items-center"
                onPress={() => {
                  navigation.navigate("ImageGallery", {
                    word: wordItem.id,
                  });
                }}
              >
                <ImageUp color={"#fff"} opacity={0.9} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <ScrollView className=" flex-1  w-full">
          <View
            style={{
              backgroundColor: "#ffffff0a",
              borderRadius: 12,
            }}
            className="p-4 w-full "
          >
            {wordItem.meanings.map((meaning, index) => (
              <View
                style={
                  wordItem.meanings.length > 1 &&
                  index !== wordItem.meanings.length - 1 && { marginBottom: 16 }
                }
                className=" w-full"
                key={index}
              >
                <Text
                  className="font-bold"
                  style={{
                    color: "#fff",
                    opacity: 0.7,
                  }}
                >
                  {meaning.partOfSpeech}
                </Text>
                <TouchableOpacity
                  //generating conv by designated conv
                  onPress={() => {
                    handleGenerateConvWithDef(
                      meaning?.definition || meaning?.definitions[0]?.definition
                    );
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      opacity: 0.7,
                    }}
                    className="mt-2"
                  >
                    {meaning?.definition || meaning?.definitions[0]?.definition}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* FOOTER  */}
        <View className="mt-auto opacity-0" />
      </View>
    </LinearGradient>
  );
};

export default ExpalnationPage;
