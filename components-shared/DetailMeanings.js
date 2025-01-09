import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import PronunciationButton from "./PronunciationButton";

const DetailMeaning = ({
  meanings,
  searchedWord,
  phonetics,
  searchNewWord,
}) => {
  return (
    <ScrollView className="p-6 rounded-xl shadow-lg overflow-hidden flex-1 bg-white">
      <View className="flex-row  justify-between items-center">
        <View>
          <Text className="font-semibold text-xl">{searchedWord}</Text>
          <Text className="font-semibold  text-gray-300 mt-2">
            {phonetics?.text}
          </Text>
        </View>
        {phonetics?.audio && (
          <PronunciationButton audioUrl={phonetics?.audio} />
        )}
      </View>
      {meanings.map((meaning, index) => (
        <View key={index} style={styles.meaningContainer}>
          <Text className="my-4" style={styles.partOfSpeech}>
            {meaning.partOfSpeech}
          </Text>
          {meaning.definitions.map((def, defIndex) => (
            <View key={defIndex} style={styles.definitionContainer}>
              <Text
                className="  text-sm text-gray-600"
                style={styles.definition}
              >
                {def.definition}
              </Text>
              {def.synonyms?.length > 0 && (
                <Text style={styles.synonyms}>
                  Synonyms: {def.synonyms.join(", ")}
                </Text>
              )}
              {def.antonyms.length > 0 && (
                <Text style={styles.antonyms}>
                  Antonyms: {def.antonyms.join(", ")}
                </Text>
              )}
            </View>
          ))}
          <View className="mt-2">
            {meaning.synonyms.length > 0 && (
              <Text style={styles.synonyms}>
                {meaning.synonyms.map((synonym) => (
                  <TouchableOpacity
                    onPress={() => {
                      searchNewWord(synonym);
                    }}
                    className="border rounded-xl bg-black p-2 mx-2 my-1"
                    key={synonym}
                  >
                    <Text className=" text-white">{synonym}</Text>
                  </TouchableOpacity>
                ))}
              </Text>
            )}
          </View>
          {meaning.antonyms.length > 0 && (
            <Text style={styles.synonyms}>
              {meaning.antonyms.map((antonyms) => (
                <TouchableOpacity
                  onPress={() => {
                    searchNewWord(antonyms);
                  }}
                  className=" rounded-xl bg-white  shadow-sm p-2 mx-2 my-1"
                  key={antonyms}
                >
                  <Text className=" text-black">{antonyms}</Text>
                </TouchableOpacity>
              ))}
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
  },
  meaningContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  partOfSpeech: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  definitionContainer: {
    marginBottom: 5,
  },
  definition: {
    fontSize: 13,
  },
  synonyms: {
    fontSize: 12,
    color: "#666",
  },
  antonyms: {
    fontSize: 12,
    color: "#666",
  },
});

export default DetailMeaning;
