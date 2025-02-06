import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import MainScreen from "./MainScreen";
import { auth, db } from "../../firebase";
import InventoryScreen from "../inventory/InventoryScreen";

import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import {
  setSavedStoryList,
  setSavedWordList,
  setSearchHistory,
} from "../../slices/userInfoSlice";
import { setList } from "../../slices/languageSlice";
import { CookingPot } from "lucide-react-native";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        props.navigation.navigate("LoginWelcome");
        props.navigation.closeDrawer();
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={styles.drawerContainer}
      {...props}
    >
      {/* Drawer Items */}
      <DrawerItemList {...props} />

      {/* Sign Out Button */}
      <TouchableOpacity onPress={signOut} style={styles.signOutButton}>
        <MaterialIcons name="logout" size={20} color="#fff" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerEntryScreen = () => {
  const [isSettingUp, setIsSettingUp] = useState(true);

  const dispatch = useDispatch();
  const uid = auth.currentUser?.uid; // Get current user UID

  useEffect(() => {
    const setUpGlobalVariable = async () => {
      if (uid) {
        await fetchUserSavedWordList();
        await fetchSearchHistory();
        await fetchLanguageList();
        await fetchUserSavedStoryList();
        setIsSettingUp(false);
      }
    };
    setUpGlobalVariable();
  }, [uid]); // Re-run if UID changes (i.e., on login/logout)

  const fetchLanguageList = async () => {
    const apiPoint = `https://apifree.forvo.com/key/2319e40ba1cbae8dc8a250c59df43868/format/json/action/language-list/order/name`;
    if (!uid) return;
    try {
      const response = await fetch(apiPoint);
      const data = await response.json();

      if (data?.items?.length > 0) {
        dispatch(setList(data.items));
      }
    } catch (error) {
      console.error("Error fetching language list:", error);
    }
  };

  const fetchSearchHistory = async () => {
    if (!uid) return; // Guard against missing UID
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user's document

      // Real-time listener for changes in the document
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();

          // Access the searchHistory field
          const searchHistory = userData.searchHistory || [];

          // Update Redux or component state
          dispatch(setSearchHistory(searchHistory));
        } else {
          console.warn("User document does not exist.");
        }
      });

      // Return unsubscribe function to clean up listener when needed
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching search history:", error);
    }
  };

  const fetchUserSavedWordList = async () => {
    if (!uid) return; // Guard against UID being unavailable

    try {
      // Reference to the user's wordList subcollection
      const wordListRef = collection(db, "users", uid, "wordList");
      const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

      // Listen for real-time changes to the wordList
      const unsubscribe = onSnapshot(
        wordListQuery,
        (snapshot) => {
          const wordsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Dispatch the updated word list to the Redux store
          dispatch(setSavedWordList(wordsData));
        },
        (error) => {
          console.error("Error listening to wordList snapshot:", error);
          // Optionally, handle the error in the UI or with a Redux action
          dispatch(
            setError("Failed to fetch the word list. Please try again.")
          );
        }
      );

      // Clean up the subscription when the component unmounts or when the user changes
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user saved word list:", error);
      // Optionally, handle the error in the UI or with a Redux action
      dispatch(setError("Failed to fetch the word list. Please try again."));
    }
  };

  const fetchUserSavedStoryList = async () => {
    if (!uid) return; // Ensure UID is available

    try {
      // Reference to the user's storyList subcollection
      const storyListRef = collection(db, "users", uid, "storyList");
      const storyListQuery = query(storyListRef, orderBy("createdAt", "desc"));

      // Listen for real-time changes in the storyList
      const unsubscribe = onSnapshot(
        storyListQuery,
        (snapshot) => {
          const storiesData = snapshot.docs.map((doc) => ({
            id: doc.id, // storyId from Firestore
            ...doc.data(), // The packetizedStory object
          }));

          // Dispatch the updated story list to Redux
          dispatch(setSavedStoryList(storiesData));
        },
        (error) => {
          console.error("Error listening to storyList snapshot:", error);
          dispatch(
            setError("Failed to fetch the saved stories. Please try again.")
          );
        }
      );

      // Clean up the subscription when the component unmounts or the user changes
      return () => unsubscribe();
    } catch (error) {
      console.error("Error fetching user saved story list:", error);
      dispatch(
        setError("Failed to fetch the saved stories. Please try again.")
      );
    }
  };

  if (isSettingUp) {
    return (
      <View className="flex w-full h-full justify-center items-center">
        <Text>Settingup...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#fff" },
        drawerActiveBackgroundColor: "#6D60F3ff",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
        drawerPosition: "right",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="list" color={color} size={size} />
          ),
        }}
      >
        {(props) => <MainScreen {...props} />}
      </Drawer.Screen>
      <Drawer.Screen
        name="WordList"
        component={InventoryScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerEntryScreen;

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingVertical: 20,
  },

  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: "auto",
    backgroundColor: "#6D60F3ff",
  },
  signOutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});
