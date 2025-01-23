import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { Bookmark } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addWordToSavedList,
  removeWordFromSavedList,
} from "../../../slices/userInfoSlice";
import { auth, db } from "../../../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

const SaveBtn = ({ word, imgUrl }) => {
  const uid = auth.currentUser?.uid;

  const dispatch = useDispatch();
  const savedWordsFromStore = useSelector((state) => {
    try {
      return state.userInfo.savedWordList;
    } catch (error) {
      console.log("Error parsing savedWordList:", error);
      return [];
    }
  });

  function checkIfWordExists(word) {
    // Loop through each item in the data array
    return savedWordsFromStore.some((wordItem) => wordItem.id === word);
  }

  const [ifSaved, setifSaved] = useState(false);

  useEffect(() => {
    setifSaved(checkIfWordExists(word.id));
  }, [savedWordsFromStore]);

  const addWord = async (word) => {
    const packetizedWord = {
      ...word,
      imgUrl,
      timeStamp: new Date().toISOString(),
    };
    // Optimistically update Redux
    dispatch(addWordToSavedList(packetizedWord));

    try {
      await setDoc(doc(db, "users", uid, "wordList", word.id), packetizedWord);
      console.log("Word saved successfully!");
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  const removeWord = async (word) => {
    // Optimistically update Redux by removing the word
    dispatch(removeWordFromSavedList(word));

    const wordDocRef = doc(db, "users", uid, "wordList", word.id); // Reference to the specific word document

    try {
      await deleteDoc(wordDocRef); // Delete the document
      console.log(`Word with ID ${word.id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return ifSaved ? (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#3f3339",
      }}
      className="flex justify-center items-center"
      onPress={() => {
        removeWord(word);
      }}
    >
      <Bookmark color={"#d1461e"} fill={"#d1461e"} />
    </TouchableOpacity>
  ) : (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: "#39404e",
      }}
      className="flex justify-center items-center"
      onPress={() => {
        addWord(word);
      }}
    >
      <Bookmark color={"#66686b"} fill={"#66686b"} />
    </TouchableOpacity>
  );
};

export default SaveBtn;
