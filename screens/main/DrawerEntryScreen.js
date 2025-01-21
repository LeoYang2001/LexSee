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
import WordListScreen from "../inventory/WordListScreen";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setSavedWordList, setSearchHistory } from "../../slices/userInfoSlice";

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
    if (uid) {
      fetchUserSavedWordList();
      fetchSearchHistory();
    }
  }, [uid]); // Re-run if UID changes (i.e., on login/logout)

  const fetchSearchHistory = async () => {
    if (!uid) return; // Guard against missing UID
    try {
      const userDocRef = doc(db, "users", uid); // Reference to the user's document

      // Real-time listener for changes in the document
      const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
        console.log("fetch search history...");
        if (docSnap.exists()) {
          const userData = docSnap.data();

          // Access the searchHistory field
          const searchHistory = userData.searchHistory || [];

          // Update Redux or component state
          console.log("Search history updated:", searchHistory);
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

    const wordListRef = collection(db, "users", uid, "wordList"); // Reference to the user's wordList subcollection
    const wordListQuery = query(wordListRef, orderBy("timeStamp", "desc"));

    // Listen for real-time changes to the wordList
    const unsubscribe = onSnapshot(wordListQuery, (snapshot) => {
      const wordsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Dispatch the updated word list to the Redux store
      dispatch(setSavedWordList(wordsData));
      setIsSettingUp(false);
    });

    // Clean up the subscription when the component unmounts or when the user changes
    return () => unsubscribe();
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
        component={WordListScreen}
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
