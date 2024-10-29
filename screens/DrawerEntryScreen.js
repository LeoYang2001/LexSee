import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { auth } from "../firebase"; // Make sure you import the firebase auth
import MainScreen from "./MainScreen";
import WordListScreen from "./WordListScreen";
import WordListScreenWithBottomSheet from "./WordListScreen";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  const signOut = () => {
    auth
      .signOut()
      .then(() => {
        // Navigate back to the SignIn screen after sign out
        props.navigation.navigate("LoginWelcome");
        props.navigation.closeDrawer();
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <TouchableOpacity
        onPress={signOut}
        style={{
          margin: 20,
          padding: 10,
          backgroundColor: "#f56",
          borderRadius: 5,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Sign Out</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerEntryScreen = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Main" component={MainScreen} />
      <Drawer.Screen name="WordList" component={WordListScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerEntryScreen;
