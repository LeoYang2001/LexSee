import { View, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Bookmark } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addWordToSavedList,
  removeWordFromSavedList,
} from "../../../slices/userInfoSlice";
import { auth, db } from "../../../firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

const SaveBtn = ({ wordItem, imgUrl }) => {
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

  const [ifSaved, setifSaved] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale
  const colorAnim = useRef(new Animated.Value(0)).current; // Initial color state (0 for not saved, 1 for saved)
  const [iconColor, setIconColor] = useState("#66686b"); // Default unsaved color

  useEffect(() => {
    setifSaved(checkIfWordExists(wordItem.id));
  }, [savedWordsFromStore]);

  useEffect(() => {
    // Trigger animation when ifSaved changes
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1.2, // Slight stretch
        friction: 2,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: ifSaved ? 1 : 0,
        duration: 300,
        useNativeDriver: false, // For non-layout properties like color
      }),
    ]).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1, // Return to original scale
        friction: 2,
        useNativeDriver: true,
      }).start();
    });

    // Interpolate color and set it as a static value
    const interpolatedColor = colorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["#66686b", "#d1461e"], // From not saved to saved color
    });

    colorAnim.addListener(({ value }) => {
      const interpolated = interpolatedColor.__getValue();
      setIconColor(interpolated); // Update state with computed hex color
    });

    return () => {
      colorAnim.removeAllListeners();
    };
  }, [ifSaved]);

  const checkIfWordExists = (word_id) =>
    savedWordsFromStore.some((wordItem) => wordItem.id === word_id);

  const addWord = async (wordItem) => {
    const packetizedWord = {
      ...wordItem,
      imgUrl,
      timeStamp: new Date().toISOString(),
    };
    dispatch(addWordToSavedList(packetizedWord));
    try {
      await setDoc(
        doc(db, "users", uid, "wordList", wordItem.id),
        packetizedWord
      );
      console.log("Word saved successfully!");
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  const removeWord = async (wordItem) => {
    dispatch(removeWordFromSavedList(wordItem));
    const wordDocRef = doc(db, "users", uid, "wordList", wordItem.id);
    try {
      await deleteDoc(wordDocRef);
      console.log(`Word with ID ${wordItem.id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting word:", error);
    }
  };

  return (
    <TouchableOpacity
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: ifSaved ? "#3f3339" : "#39404e",
      }}
      className="flex justify-center items-center"
      onPress={() => {
        if (ifSaved) {
          removeWord(wordItem);
        } else {
          addWord(wordItem);
        }
      }}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Bookmark color={iconColor} fill={iconColor} />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default SaveBtn;
