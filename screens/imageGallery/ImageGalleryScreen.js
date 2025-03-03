import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ChevronLeft } from "lucide-react-native";
import ImageList from "./components/ImageList";
import ConfirmButton from "./components/ConfirmButton";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

const ImageGalleryScreen = ({ navigation, route }) => {
  const promptWord = route.params.word;
  const [isSearching, setIsSearching] = useState(false);
  const [imagesResults, setimagesResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // To know if there are more images to load
  const [selectedImgs, setSelectedImgs] = useState([]);
  //States control confirmBtn popup
  const [ifConfirmBtn, setIfConfirmBtn] = useState(false);
  const [confirmImg, setConfirmImg] = useState(null);

  //Handle Save word (binding the image to the wordItem)
  const handleSavingWord = (imgUrl) => {
    //go back to definition page and update the img url
    navigation.navigate("Definition", { imgPlaceHolderUrl: imgUrl });
  };

  const handleConfirmPop = (imgUrl) => {
    setIfConfirmBtn(true);
    setConfirmImg(imgUrl);
  };

  const handleConfirmImg = () => {
    setIfConfirmBtn(false);
    handleSavingWord(confirmImg);
  };

  const handleCancelConfirm = () => {
    setIfConfirmBtn(false);
    setConfirmImg(null);
  };

  useEffect(() => {
    handleSearchImage(promptWord);
    fetchSelectedImgs(promptWord);
  }, [promptWord]);

  //SelectedImg fetch
  const fetchSelectedImgs = async (wordId) => {
    const wordDocRef = doc(db, "savedImgUrls", wordId); // Reference to the word document in Firestore

    try {
      const wordDocSnap = await getDoc(wordDocRef); // Get the current data for the word
      if (wordDocSnap.exists()) {
        const wordData = wordDocSnap.data();

        let imgUrls = wordData.savedImgUrl || []; // Default to an empty array if no saved images

        // Sort images by count in descending order
        imgUrls.sort((a, b) => b.count - a.count);

        // Get the top 3 most selected images with imgUrl and count
        const topImages = imgUrls.slice(0, 3);

        console.log(`Top 3 images for word ${wordId}:`, topImages);
        setSelectedImgs(topImages);
        return topImages;
      } else {
        console.log(`Word document not found: ${wordId}`);
      }
    } catch (error) {
      console.error("Error fetching selected images:", error);
    }
  };

  //IMAGE SEARCH function
  const handleSearchImage = async (urlWord, newPage = 1) => {
    try {
      const apiKey = "AIzaSyDLKsMGMoJOmf5xz6JzHHhRONt96GmMG80";
      const cx = "2121e0d2556664ff3";
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=the+illustration+of+${urlWord}&cx=${cx}&searchType=image&key=${apiKey}&start=${
          (newPage - 1) * 10 + 1
        }`
      );
      const data = await response.json();
      if (data.items) {
        // Append new images to the current list
        setimagesResults((prevImages) => [
          ...prevImages,
          ...data.items.filter(
            (item) => item.link && item.link.startsWith("http")
          ),
        ]);
        // Set `hasMore` to `false` if fewer items are returned than requested (indicating end of results)
        setHasMore(data.items.length === 10);
        setPage(newPage);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching images:", error);
      setHasMore(false);
    } finally {
    }
  };

  const fetchMoreImages = () => {
    if (hasMore) {
      handleSearchImage(promptWord, page + 1);
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#121417",
      }}
      className="w-full h-full  flex-col relative"
    >
      <View className="w-full h-full  flex-col  px-4">
        {/* Header  */}
        <View className=" pt-10   flex flex-row items-center  justify-between">
          <TouchableOpacity
            className="py-2"
            onPress={() => {
              navigation.goBack();
            }}
          >
            <ChevronLeft color={"#fff"} />
          </TouchableOpacity>
        </View>
        <View className="flex-1 w-full">
          <View className="py-3 flex flex-col gap-2">
            <Text
              className="font-bold"
              style={{
                fontSize: 28,
                color: "#fff",
              }}
            >
              Explore
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#fff",
                opacity: 0.6,
              }}
            >
              Let's memorize word {promptWord} in a easier way
            </Text>
          </View>
          {isSearching ? (
            <View className="flex-1 w-full  justify-center items-center">
              <ActivityIndicator color={"#F54B17"} />
            </View>
          ) : (
            <View className="flex-1 w-full ">
              {imagesResults.length > 0 && (
                <ImageList
                  selectedImgs={selectedImgs}
                  handleConfirmPop={handleConfirmPop}
                  onSaveWord={handleSavingWord}
                  images_result={imagesResults}
                  fetchMoreImages={fetchMoreImages}
                  page={page}
                />
              )}
            </View>
          )}
        </View>
      </View>

      {/* CONFIRM BUTTON  */}
      {ifConfirmBtn && (
        <Pressable
          onPress={() => {
            setIfConfirmBtn(false);
          }}
          style={{
            backgroundColor: "rgba(0,0,0,0.7)",
          }}
          className="absolute w-full h-full  flex justify-center items-center"
        >
          <ConfirmButton
            handleConfirmImg={handleConfirmImg}
            handleCancelConfirm={handleCancelConfirm}
            confirmImg={confirmImg}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    margin: 5,
  },
  image: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
    borderRadius: 10,
  },
});

export default ImageGalleryScreen;
