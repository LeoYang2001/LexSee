import { useDispatch, useSelector } from "react-redux";
import {
  addWordToSavedList,
  removeMultipleWordsFromSavedList,
  removeWordFromSavedList,
} from "./slices/userInfoSlice";
import { deleteDoc, doc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

const uid = auth.currentUser?.uid;

const dispatch = useDispatch();

// Add a word to savedWordList
const addWord = async (word) => {
  // Optimistically update Redux
  dispatch(addWordToSavedList(word));

  try {
    await setDoc(doc(db, "users", uid, "wordList", word.id), word);
    console.log("Word saved successfully!");
  } catch (error) {
    console.error("Error saving word:", error);
  }
};

// Remove a word from savedWordList
const removeWord = async (word) => {
  // Optimistically update Redux
  dispatch(removeWordFromSavedList(word));

  const wordDocRef = doc(db, "users", uid, "wordList", word.id); // Reference to the specific word document

  try {
    await deleteDoc(wordDocRef); // Delete the document
    console.log(`Word with ID ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting word:", error);
  }
};

const removeWords = async (words) => {
  if (!Array.isArray(words) || words.length === 0) {
    console.error("No words provided for deletion.");
    return;
  }

  try {
    // Optimistically update Redux (removes all words at once)
    // dispatch(removeMultipleWordsFromSavedList(words));

    // Iterate through words and delete each one
    for (const word of words) {
      if (!word?.id) {
        console.warn("Skipping word with missing ID:", word);
        continue;
      }

      const wordDocRef = doc(db, "users", uid, "wordList", word.id);
      await deleteDoc(wordDocRef);
      console.log(`Word with ID ${word.id} deleted successfully.`);
    }

    console.log("All words deleted successfully.");
  } catch (error) {
    console.error("Error deleting words:", error);
  }
};

export default { addWord, removeWord, removeWords };
