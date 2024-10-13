import {
  View,
  Text,
  Pressable,
  Keyboard,
  Dimensions,
  TouchableOpacity,
  Button,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import * as Clipboard from "expo-clipboard";
import { Images, CircleAlert } from "lucide-react-native";

const SaveWordPopup = ({ handleSavingWord, setIfPopUpWin }) => {
  const [uploadImgUrl, setUploadImgUrl] = useState("");
  const [showButton, setShowButton] = useState(false);
  const [imageError, setImageError] = useState(false); // State to handle image error
  const translateY = useSharedValue(500); // Start off-screen

  const opacity = useSharedValue(0); // For fading in/out the button

  const fadeInOutButton = () => {
    if (showButton) return;

    const btnDur = 350;
    // Fade in
    opacity.value = withTiming(1, { duration: btnDur }); // Fade in within 500ms
    setShowButton(true);
    // Fade out after 3 seconds
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: btnDur }); // Fade out within 500ms
      setShowButton(false);
    }, 3000);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  // Function to check if the image URL is valid
  const isImageValid = async (url) => {
    try {
      const response = await fetch(url);
      return (
        response.ok && response.headers.get("content-type").startsWith("image/")
      );
    } catch (error) {
      return false; // In case of an error, return false
    }
  };

  const getClipboardValue = async () => {
    const copiedText = await Clipboard.getStringAsync();
    const isValid = await isImageValid(copiedText);

    if (isValid) {
      setUploadImgUrl(copiedText);
      setImageError(false); // Reset any previous errors
    } else {
      setImageError(true); // Set image error state
      setUploadImgUrl(""); // Clear invalid image URL
    }
  };

  useEffect(() => {
    // Animate the popup in when the component mounts
    translateY.value = withTiming(0, { duration: 300 }); // Slide in from the bottom
  }, [translateY]);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  return (
    <Pressable
      onPress={() => {
        Keyboard.dismiss();
        translateY.value = withTiming(600, { duration: 300 });
        setTimeout(() => {
          setIfPopUpWin(false);
        }, 330);
      }}
      style={{
        width: windowWidth,
        height: windowHeight,
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
      className="absolute flex justify-center items-center z-30"
    >
      {/* SaveWordComp */}
      <Animated.View
        style={[
          {
            height: 500,
            width: 350,
          },
          translateStyle, // Apply slide-in effect
        ]}
        className="p-10 rounded-2xl bg-white mt-auto mb-10 flex flex-col justify-start items-center"
      >
        {/* Image Preview */}
        <Pressable
          className="w-full rounded-2xl flex-1"
          style={{
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f0f0", // Set a background color for the image container
          }}
        >
          {imageError ? (
            <CircleAlert size={28} color={"red"} />
          ) : uploadImgUrl ? (
            // Render the image from the clipboard URL
            <Pressable
              className="w-full h-full relative"
              onPress={fadeInOutButton} // Show the button when the image is pressed
            >
              <Image
                source={{ uri: uploadImgUrl }}
                style={{
                  width: "100%",
                  height: "100%",
                  resizeMode: "cover",
                }}
              />
              {/* Recopy paste btn - shown only after pressing the image */}
              {showButton && (
                <Animated.View
                  style={[animatedStyle]}
                  className="absolute z-20 bg-white p-2 rounded-xl right-4 bottom-4"
                >
                  <TouchableOpacity onPress={getClipboardValue}>
                    <Images color={"black"} />
                  </TouchableOpacity>
                </Animated.View>
              )}
            </Pressable>
          ) : (
            // Placeholder template when no image is available
            <TouchableOpacity
              className="z-20 bg-white p-2 rounded-xl"
              onPress={getClipboardValue}
            >
              <Images color={"black"} />
            </TouchableOpacity>
          )}
        </Pressable>
        <TouchableOpacity
          onPress={() => {
            handleSavingWord({ imgUrl: uploadImgUrl });
          }}
          className="bg-black w-full rounded-2xl flex justify-center items-center mt-10 py-4 px-4 "
        >
          <Text className="text-white font-bold">Save</Text>
        </TouchableOpacity>
      </Animated.View>
    </Pressable>
  );
};

export default SaveWordPopup;
