import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Adjust the path based on your structure
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { auth } from "../firebase"; // Import auth to get the current user's UID
import WordItem from "../components/WordItem";
import { AlignLeft, RefreshCw, X } from "lucide-react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import OpenAI from "openai";
import { reorganizeWords, synonymGroupExample } from "../constants";

const WordListScreen = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);
  const [isSorting, setIsSorting] = useState(false);

  const CHATGPT_KEY =
    "sk-proj-zla7u7ibGnm71qylVqb1T3BlbkFJbrzU9Yj0SvhpnPK6T9zl";

  const openai = new OpenAI({
    apiKey: CHATGPT_KEY,
    dangerouslyAllowBrowser: true,
  });

  useEffect(() => {
    if (!filterText) {
      setFilteredWords(words);
      return;
    }

    const filteredWords = words.filter(
      (word) => word.id.toLowerCase().includes(filterText.toLowerCase()) // Check if the word contains the filterText
    );

    setFilteredWords(filteredWords);
  }, [filterText]);

  useEffect(() => {
    const user = auth.currentUser; // Get the current user

    if (user) {
      const userId = user.uid; // Get the current user's UID
      const wordListRef = collection(db, "users", userId, "wordList"); // Reference to the user's wordList subcollection

      // Query the wordList collection and order by timestamp, in descending order (newest first)
      const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

      // Subscribe to the words in the user's wordList collection
      const unsubscribe = onSnapshot(wordListQuery, (snapshot) => {
        const wordsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWords(wordsData);
        setFilteredWords(wordsData);
        setLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setLoading(false); // If there's no user, stop loading
    }
  }, []);

  const handleDeleteWord = async (id) => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const wordDocRef = doc(db, "users", userId, "wordList", id); // Reference to the specific word document

      try {
        await deleteDoc(wordDocRef); // Delete the document
        console.log(`Word with ID ${id} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting word:", error);
      }
    }
  };

  const sortMyWordsList = async () => {
    //Get AI's result

    setIsSorting(true);
    const groupWordsList = words.map((item) => item.id);
    // setIsLoadingDef(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are an English teacher." },
          {
            role: "user",
            content: `group these words: ${groupWordsList} by its definition  and return me a js arr of these groups,
              example: ${JSON.stringify(
                synonymGroupExample
              )}, only return me the array, for the format purpose,
               the array starts with & and ends with &
            `,
          },
        ],
        model: "gpt-4o-mini",
      });

      const response = completion.choices[0].message.content;
      // format the response from AI
      const groupedArrObj = JSON.parse(response.slice(1, response.length - 1));
      const groupedArr = groupedArrObj.map((item) => item["synonyms"]);

      console.log(reorganizeWords(filteredWords, groupedArr));
      setFilteredWords(reorganizeWords(filteredWords, groupedArr));
      setIsSorting(false);

      //merge the result to the filteredWords,
    } catch (error) {
      console.error("Error in handleAISearch:", error);
    } finally {
    }
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View className="w-full px-10 mt-10 flex-row justify-between">
        <TouchableOpacity
          className="p-3 flex justify-center rounded-xl bg-white items-center"
          onPress={() => {
            navigation.openDrawer();
          }}
        >
          <AlignLeft size={24} color={"black"} />
        </TouchableOpacity>
        <TouchableOpacity
          className="p-3 flex justify-center rounded-xl bg-white items-center"
          onPress={() => {
            sortMyWordsList();
            // alert("AI search feature is not supported yet");
          }}
        >
          <RefreshCw size={24} color={"black"} />
        </TouchableOpacity>
      </View>
      <View className="flex-1">
        <View
          className={` mx-10 my-10  z-20  bg-gray-200  ${
            !filterText && "rounded-xl"
          }`}
        >
          <TextInput
            className="text-lg w-full py-2 px-4 "
            value={filterText}
            onChangeText={setFilterText}
          />
          {filterText && (
            <Pressable
              onPress={() => {
                setFilterText("");
              }}
              className="absolute h-full flex justify-center items-center mr-4  right-0 z-0"
            >
              <X color={"gray"} fontSize={14} />
            </Pressable>
          )}
        </View>

        {/* <FlatList
          data={filteredWords}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false} // Hide vertical scroll indicator
        /> */}
        {isSorting ? (
          <ActivityIndicator />
        ) : (
          <ScrollView>
            {filteredWords.map((item) => (
              <WordItem
                key={item.id}
                imgUrl={item.imgUrl}
                word={item.id}
                phonetics={item.phonetics}
                onDelete={handleDeleteWord}
                itemColor={item?.groupColor}
              />
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  image: {
    width: 50, // Adjust width as needed
    height: 50, // Adjust height as needed
    borderRadius: 25, // Optional: rounded image
    marginRight: 10,
  },
  textContainer: {
    flex: 1, // Take the remaining space
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phonetics: {
    fontSize: 14,
    color: "#666",
  },
});

export default WordListScreen;
