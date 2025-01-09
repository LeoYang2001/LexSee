import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { AlignLeft, RefreshCw, X } from "lucide-react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ScrollView } from "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import CustomBackdrop from "./components/CustomBackdrop";
import WordItem from "./components/WordItem";
import { auth, db } from "../../firebase";
import WordDetail from "./components/WordDetail";

const WordListScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [displayedWord, setDisplayedWord] = useState(null);
  const [bottomSheetViewMode, setBottomSheetViewMode] = useState("small");

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["46%", "100%"];

  const scrollRef = useRef();

  //function to view the latest saved word
  const route = useRoute();

  // Define the function you want to run on screen load
  const displayLatestSavedWord = () => {
    setDisplayedWord(filteredWords[0]);
    bottomSheetModalRef.current.present();
  };

  useEffect(() => {
    // Apply the filter whenever filterText changes
    const filtered = words.filter((item) => {
      return item.id.toLowerCase().includes(filterText.trim().toLowerCase()); // Filter by word ID
    });

    // Update the filtered words list
    setFilteredWords(filtered);
  }, [filterText, words]);

  useEffect(() => {
    // Check if callFunction is set to true, then call someFunction
    if (route.params?.callFunction && bottomSheetModalRef?.current) {
      setTimeout(() => {
        displayLatestSavedWord();
      }, 500);
    }
  }, [route.params, bottomSheetModalRef]);

  // callbacks
  const handleOpenSheet = useCallback((item) => {
    setDisplayedWord(item);
    bottomSheetModalRef.current?.present();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index == 2) {
      setBottomSheetViewMode("large");
    } else {
      setBottomSheetViewMode("small");
    }
  }, []);

  useEffect(() => {
    const user = auth.currentUser;

    if (user) {
      const userId = user.uid;
      const wordListRef = collection(db, "users", userId, "wordList");
      const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

      const unsubscribe = onSnapshot(wordListQuery, (snapshot) => {
        const wordsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setWords(wordsData);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
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

  if (loading) {
    return (
      <ActivityIndicator size="small" color="gray" style={styles.loading} />
    );
  }

  return (
    <SafeAreaView className="relative" style={styles.container}>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <View className="flex-1">
            <View className="w-full px-10 mt-10 flex-row justify-between">
              <TouchableOpacity
                className="p-3 flex justify-center rounded-xl bg-white items-center"
                onPress={() => {
                  navigation.openDrawer();
                }}
              >
                <AlignLeft size={24} color={"black"} />
              </TouchableOpacity>
              {/* <TouchableOpacity
                className="p-3 flex justify-center rounded-xl bg-white items-center"
                onPress={() => {
                  sortMyWordsList();
                }}
              >
                <RefreshCw size={24} color={"black"} />
              </TouchableOpacity> */}
            </View>
            <View className="flex-1">
              <View
                className={`mx-10 my-10 z-20 bg-gray-200 ${
                  !filterText && "rounded-xl"
                }`}
              >
                <TextInput
                  className="text-lg w-full py-2 px-4"
                  value={filterText}
                  onChangeText={setFilterText}
                />
                {filterText && (
                  <Pressable
                    onPress={() => {
                      setFilterText("");
                    }}
                    className="absolute h-full flex justify-center items-center mr-4 right-0 z-0"
                  >
                    <X color={"gray"} fontSize={14} />
                  </Pressable>
                )}
              </View>

              {isSorting ? (
                <ActivityIndicator />
              ) : (
                <ScrollView scrollEnabled={true}>
                  {filteredWords.map((item) => (
                    <WordItem
                      key={item.id}
                      imgUrl={item.imgUrl}
                      word={item.id}
                      handlePresentModalPress={() => {
                        handleOpenSheet(item);
                      }}
                      wordItem={item}
                      phonetics={item.phonetics}
                      onDelete={handleDeleteWord}
                      itemColor={item?.groupColor}
                      scrollRef={scrollRef}
                      bottomSheetModalRef={bottomSheetModalRef}
                    />
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          {/* BOTTOM SHEET */}
          <BottomSheetModal
            backgroundStyle={{
              backgroundColor: "black",
              borderRadius: 45,
            }}
            onTouchStart={() => {}}
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            handleComponent={bottomSheetViewMode === "large" ? null : undefined}
            onChange={handleSheetChanges}
            backdropComponent={(props) => (
              <CustomBackdrop {...props} bottomSheetRef={bottomSheetModalRef} />
            )}
          >
            <BottomSheetView>
              {/* words detailed definition  */}
              <View
                className=" relative overflow-visible"
                style={{
                  height: Dimensions.get("window").height * 0.45,
                }}
              >
                {bottomSheetViewMode === "small" && (
                  <>
                    {/* HANDLE BAR  */}
                    <View
                      style={{ height: 6 }}
                      className="w-10  bg-white self-center  rounded-md "
                    />
                  </>
                )}
                <WordDetail
                  navigation={navigation}
                  bottomSheetModalRef={bottomSheetModalRef}
                  wordItem={displayedWord}
                  setBottomSheetViewMode={setBottomSheetViewMode}
                  bottomSheetViewMode={bottomSheetViewMode}
                />
              </View>
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
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
});

export default WordListScreen;
