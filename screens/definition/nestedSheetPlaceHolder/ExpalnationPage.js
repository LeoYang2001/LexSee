import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React from "react";
import { Bookmark, Volume2 } from "lucide-react-native";

const ExpalnationPage = () => {
  const wordItem = {
    id: "culpable",
    imgUrl: "https://cdn.langeek.co/photo/23505/original/?type=jpeg",
    meanings: [
      {
        antonyms: [],
        definitions: [
          "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
        ],
        partOfSpeech: "adjective",
        synonyms: [],
      },
      {
        antonyms: [],
        definitions: [
          "Actuated by avarice; extremely greedy for wealth or material gain; immoderately desirous of accumulating property.",
        ],
        partOfSpeech: "adjective",
        synonyms: [],
      },
    ],
    phonetics: {
      audio:
        "https://api.dictionaryapi.dev/media/pronunciations/en/culpable-us.mp3",
      license: {
        name: "BY-SA 3.0",
        url: "https://creativecommons.org/licenses/by-sa/3.0",
      },
      sourceUrl: "https://commons.wikimedia.org/w/index.php?curid=789670",
      text: "/ˈkʌlpəbəl/",
    },
    timeStamp: "2024-11-03T23:14:17.405Z",
  };

  return (
    <View className="w-full h-full py-8 px-5 flex   flex-col gap-4 ">
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
                {meaning.definitions}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* FOOTER  */}
      <View className="mt-auto opacity-0" />
    </View>
  );
};

export default ExpalnationPage;
