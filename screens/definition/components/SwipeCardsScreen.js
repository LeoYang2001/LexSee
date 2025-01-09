import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const { width } = Dimensions.get("window");
const SCREEN_WIDTH = width;

const SwipeCardsScreen = ({ card1: Card1Component, card2: Card2Component }) => {
  const [activeTab, setActiveTab] = useState(0); // 0 for card1, 1 for card2
  const translateX = useSharedValue(0); // This will control card swiping
  const barTranslateX = useSharedValue(0); // For animated sliding bar

  // Store the initial position of the swipe to prevent flickering behavior
  const startingPosition = useSharedValue(0);

  const handleTabPress = (index) => {
    setActiveTab(index);
    translateX.value = withSpring(index === 0 ? 0 : -SCREEN_WIDTH); // Move card
    barTranslateX.value = withSpring(index === 0 ? 0 : (SCREEN_WIDTH - 80) / 2); // Move the bar
  };

  const handleGestureEvent = (event) => {
    const translationX = event.nativeEvent.translationX;
    translateX.value = startingPosition.value + translationX; // Adjust swipe based on starting position
  };

  const handleGestureEnd = (event) => {
    const translationX = event.nativeEvent.translationX;
    const velocityX = event.nativeEvent.velocityX;

    if (translationX < -50 || velocityX < -50) {
      setActiveTab(1);
      translateX.value = withSpring(-SCREEN_WIDTH); // Swipe to Card 2
      barTranslateX.value = withSpring((SCREEN_WIDTH - 80) / 2); // Move the bar to Card 2
    } else if (translationX > 50 || velocityX > 50) {
      setActiveTab(0);
      translateX.value = withSpring(0); // Swipe back to Card 1
      barTranslateX.value = withSpring(0); // Move the bar back to Card 1
    } else {
      // Snap back to the current card if not enough swipe distance
      translateX.value = withSpring(activeTab === 0 ? 0 : -SCREEN_WIDTH);
    }
  };

  const onGestureStart = () => {
    startingPosition.value = translateX.value; // Record the starting position before the swipe begins
  };

  // Animated styles for the cards
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Animated style for the sliding bar
  const barStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: barTranslateX.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1">
      <GestureHandlerRootView style={styles.container}>
        {/* Tab Bar */}
        <View className=" mb-10">
          <View className="flex-row justify-between ">
            <TouchableOpacity
              className=" flex justify-center items-center"
              style={styles.tabButton}
              onPress={() => handleTabPress(0)}
            >
              <Text
                className="font-semibold"
                style={[
                  styles.tabText,
                  activeTab === 0 && styles.activeTabText,
                ]}
              >
                Definition
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className=" flex justify-center items-center"
              style={styles.tabButton}
              onPress={() => handleTabPress(1)}
            >
              <Text
                className="font-semibold"
                style={[
                  styles.tabText,
                  activeTab === 1 && styles.activeTabText,
                ]}
              >
                Image
              </Text>
            </TouchableOpacity>
          </View>
          {/* Animated sliding bar */}
          <Animated.View
            className="flex  justify-center items-center"
            style={[styles.slidingBar, barStyle]}
          >
            <View
              style={{ height: 4 }}
              className="bg-black w-24 rounded-full  mt-4"
            ></View>
          </Animated.View>
        </View>

        {/* Swipable Cards */}
        <PanGestureHandler
          onGestureEvent={handleGestureEvent}
          onEnded={handleGestureEnd}
          onBegan={onGestureStart} // Capture starting point when gesture begins
        >
          <Animated.View style={[styles.cardContainer, animatedStyle]}>
            {/* Render the cards passed through props */}
            <View style={[styles.card, { backgroundColor: "transparent" }]}>
              {Card1Component()}
            </View>
            <View style={[styles.card, { backgroundColor: "transparent" }]}>
              {Card2Component()}
            </View>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarContainer: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    position: "relative", // Necessary for positioning the sliding bar
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingVertical: 6,
    backgroundColor: "#f0f0f0",
  },
  tabButton: {
    paddingHorizontal: 20,
    borderRadius: 20,
    width: "50%",
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "gray",
  },
  activeTabText: {
    color: "#000",
  },
  slidingBar: {
    height: 4,
    width: (SCREEN_WIDTH - 80) / 2, // Half of screen width (for 2 tabs)
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  cardContainer: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    paddingBottom: 30,
  },
  card: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    marginRight: 80,
  },
  cardText: {
    fontSize: 24,
    color: "#fff",
  },
});

export default SwipeCardsScreen;
