import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Pressable,
  TextInput,
  TouchableOpacity,
  Text,
  Dimensions,
  Image,
  PanResponder,
} from "react-native";
import * as Haptics from "expo-haptics";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import CustomBackdrop from "../components/CustomBackdrop"; // Import your CustomBackdrop
import WordItem from "../components/WordItem";
import { AlignLeft, RefreshCw, X } from "lucide-react-native";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import OpenAI from "openai";
import WordDetail from "../components/WordDetail";
import { ScrollView } from "react-native-gesture-handler";

const WordListScreen = ({ navigation }) => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [filteredWords, setFilteredWords] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [displayedWord, setDisplayedWord] = useState(null);
  const [bottomSheetViewMode, setBottomSheetViewMode] = useState("small");

  const bottomSheetModalRef = useRef(null);
  const snapPoints = ["46%", "100%"];

  const scrollRef = useRef();

  // callbacks
  const handleOpenSheet = useCallback((item) => {
    setDisplayedWord(item);
    bottomSheetModalRef.current?.present();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const handleCloseSheet = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    if (index == 2) {
      setBottomSheetViewMode("large");
    } else {
      setBottomSheetViewMode("small");
    }
  }, []);

  const handleSheetAnimation = (fromIndex, toIndex) => {
    if (toIndex <= 0.5) {
      bottomSheetModalRef.current.close();
      setBottomSheetViewMode("small");
    } else if (toIndex > 0.5 && toIndex <= 1.5) {
      setBottomSheetViewMode("small");
    } else {
      setBottomSheetViewMode("large");
    }
  };

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
        setFilteredWords(wordsData);
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
              <TouchableOpacity
                className="p-3 flex justify-center rounded-xl bg-white items-center"
                onPress={() => {
                  sortMyWordsList();
                }}
              >
                <RefreshCw size={24} color={"black"} />
              </TouchableOpacity>
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
