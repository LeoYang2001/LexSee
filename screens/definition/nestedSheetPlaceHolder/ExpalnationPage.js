import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { Bookmark, Volume2 } from "lucide-react-native";
import { BlurView } from "expo-blur";
import SaveBtn from "../components/SaveBtn";
import { LinearGradient } from "expo-linear-gradient";

const ExpalnationPage = ({ wordItem, ifSaved }) => {
  return (
    <LinearGradient
      colors={["#242c3c", "#1d1f24"]}
      style={{
        borderRadius: 16,
      }}
      className="w-full h-full "
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
            <TouchableOpacity className="py-2 flex flex-row items-center">
              <Text
                style={{
                  color: "#FFFFFFB3",
                  fontSize: 18,
                }}
              >
                {wordItem?.phonetics.text}
              </Text>
              <Volume2 className="ml-2" color={"#FFFFFFB3"} size={18} />
            </TouchableOpacity>
          </View>
          <SaveBtn ifSaved={ifSaved} />
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
                uri: "https://res.cloudinary.com/djcyhbk2e/image/upload/c_limit,f_auto,q_50,w_1400/v1/gvv/prod/yp2b0ocwenuvu8jjv1zz",
              }}
              resizeMode="cover"
            />
            <BlurView
              className="w-full h-full flex justify-center items-center"
              intensity={40}
            >
              <TouchableOpacity
                style={{
                  backgroundColor: "#E44814",
                }}
                className="rounded-full px-2 py-1"
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
                <Text
                  style={{
                    color: "#fff",
                    opacity: 0.7,
                  }}
                  className="mt-2"
                >
                  {meaning?.definition || meaning?.definitions[0]?.definition}
                </Text>
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
