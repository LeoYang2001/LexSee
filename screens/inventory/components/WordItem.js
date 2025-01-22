// old file

import { EllipsisVertical, Trash2 } from "lucide-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

const WordItem = ({
  imgUrl,
  word,
  phonetics,
  onDelete,
  itemColor,
  handlePresentModalPress,
  scrollRef,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Show delete button (swipe left to reveal)
  const showDeleteBtn = () => {
    translateX.value = withSpring(-80); // swipe left
    opacity.value = withTiming(1, { duration: 300 });
  };

  const handlePressItem = () => {
    // setModalVisible(true)
    if (opacity.value > 0) {
      hideDeleteBtn();
    } else {
      // setModalVisible(true);
      handlePresentModalPress();
    }
  };

  // Hide delete button (swipe right to hide)
  const hideDeleteBtn = () => {
    translateX.value = withSpring(0); // return to original position
    opacity.value = withTiming(0, { duration: 300 });
  };

  // Gesture handler for the swipe animation
  const panGestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      // Only allow left swipes (negative translationX)
      if (event.translationX < 0) {
        translateX.value = context.startX + event.translationX;
        if (translateX.value < 0) {
          opacity.value = Math.abs(translateX.value) / 100; // opacity increases as swipe moves left
        }
      }
    },
    onEnd: () => {
      // Show delete button if swiped past threshold, otherwise hide
      if (translateX.value < -70) {
        runOnJS(showDeleteBtn)();
      } else {
        runOnJS(hideDeleteBtn)();
      }
    },
  });

  // Style for WordItem (moves as you swipe)
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Style for delete button (opacity changes as swipe moves)
  const animatedBtnStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <GestureHandlerRootView>
      <View className="mx-10" style={styles.container}>
        {/* Delete Button */}
        <Animated.View style={[styles.deleteButton, animatedBtnStyle]}>
          <TouchableOpacity
            style={styles.deleteButtonContent}
            onPress={() => {
              console.log("delete id", word);
              onDelete(word);
            }}
          >
            <Trash2 color={"red"} />
          </TouchableOpacity>
        </Animated.View>

        {/* Pan Gesture Handler for WordItem */}
        <Animated.View
          className="relative overflow-hidden"
          style={[styles.itemContainer, animatedStyle]}
        >
          <Pressable
            className="flex flex-row justify-between items-center"
            onPress={handlePressItem}
          >
            <View className=" flex-1 flex flex-row items-center">
              <Image source={{ uri: imgUrl }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.word}>{word}</Text>
                {phonetics && phonetics.text && (
                  <Text style={styles.phonetics}>{phonetics.text}</Text>
                )}
              </View>
            </View>
            <TouchableOpacity onPress={showDeleteBtn}>
              <EllipsisVertical color={"black"} />
            </TouchableOpacity>
          </Pressable>

          <View
            style={
              itemColor && {
                backgroundColor: itemColor,
              }
            }
            className=" absolute w-2  h-20  right-0 "
          ></View>
        </Animated.View>
      </View>

      {/* Modal for zoomable image */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={() => setModalVisible(false)}
        >
          <Image source={{ uri: imgUrl }} style={styles.modalImage} />
        </TouchableOpacity>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
  },
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  word: {
    fontSize: 18,
    fontWeight: "bold",
  },
  phonetics: {
    fontSize: 14,
    color: "#666",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 80, // Final width when fully shown
    height: "100%",
    position: "absolute",
    right: 0,
  },
  deleteButtonContent: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

export default WordItem;
