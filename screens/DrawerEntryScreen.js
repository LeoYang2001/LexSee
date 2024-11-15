import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { auth } from "../firebase"; // Ensure firebase auth is correctly imported
import MainScreen from "./MainScreen";
import WordListScreen from "./WordListScreen";

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

const DrawerEntryScreen = ({ route }) => {
  const savedWord = route.params?.savedWord
    ? route.params?.savedWord
    : undefined;

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#fff" },
        drawerActiveBackgroundColor: "#6D60F3ff",
        drawerActiveTintColor: "#fff",
        drawerInactiveTintColor: "#333",
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Main"
        component={MainScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="WordList"
        options={{
          drawerIcon: ({ color, size }) => (
            <MaterialIcons name="list" color={color} size={size} />
          ),
        }}
      >
        {(props) => <MainScreen {...props} savedWord={savedWord} />}
      </Drawer.Screen>
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
