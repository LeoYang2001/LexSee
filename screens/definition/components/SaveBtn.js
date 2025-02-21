import { View, TouchableOpacity, Animated } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Bookmark } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  addWordToSavedList,
  removeWordFromSavedList,
} from "../../../slices/userInfoSlice";
import { auth, db } from "../../../firebase";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { initialImgPlaceHolderUrl } from "../../../constants";

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
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(colorAnim, {
        toValue: ifSaved ? 1 : 0,
        duration: 100,
        useNativeDriver: false, // For non-layout properties like color
      }),
    ]).start(() => {
      Animated.spring(scaleAnim, {
        toValue: 1, // Return to original scale
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

  const trackSavedImgUrl = async (savedImg, wordItem) => {
    const wordId = wordItem.id; // Assuming wordItem has a 'word' property that identifies the word
    const wordDocRef = doc(db, "savedImgUrls", wordId); // Reference to the word document in Firestore

    try {
      const wordDocSnap = await getDoc(wordDocRef); // Get the current data for the word
      if (wordDocSnap.exists()) {
        const wordData = wordDocSnap.data();

        let imgUrls = wordData.savedImgUrl || []; // Default to an empty array if no saved images

        // Check if the imgUrl already exists
        const existingImgIndex = imgUrls.findIndex(
          (img) => img.imgUrl === savedImg
        );

        if (existingImgIndex !== -1) {
          // If imgUrl exists, increment the count
          imgUrls[existingImgIndex].count += 1;
        } else {
          // If imgUrl doesn't exist, add a new entry with count 1
          imgUrls.push({ imgUrl: savedImg, count: 1 });
        }

        // Update the word document with the updated imgUrls array
        await updateDoc(wordDocRef, {
          savedImgUrl: imgUrls,
        });

        console.log(
          `Image URL saved for word: ${wordItem.id}. Updated imgUrls.`
        );
      } else {
        // If the word does not exist, create a new document with the imgUrl
        await setDoc(wordDocRef, {
          savedImgUrl: [{ imgUrl: savedImg, count: 1 }], // Initialize with the first image and count 1
        });

        console.log(`New word added: ${wordItem.word}, with image.`);
      }
    } catch (error) {
      console.error("Error updating word:", error);
    }
  };

  const addWord = async (wordItem) => {
    const ifTemplate = imgUrl === initialImgPlaceHolderUrl;

    //step 0 check if img is templateimg
    if (!ifTemplate) {
      await trackSavedImgUrl((savedImg = imgUrl), wordItem);
    } else {
      console.log("Skipping image as it is a template image.");
    }

    //if imgUrl is template img, skip this step

    //otherwise, increment this word imgCount in datebase imgSavedCount (id == word (string), imgUrlSavedTop3 )
    //this feature is to track the most 3 saved imgUrl for a givin word, with this info,
    // we can help user to speed up the process of selecting images by prompt the top 3 imgs url
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
