// In App.js in a new project
import "./gesture-handler";
import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignUpScreen from "./screens/SignUpScreen";
import SignInScreen from "./screens/SignInScreen";
import MainScreen from "./screens/MainScreen";
import DrawerEntryScreen from "./screens/DrawerEntryScreen";
import DefinitionScreen from "./screens/DefinitionScreen";
import { app, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import LoginWelcomeScreen from "./screens/LoginWelcomeScreen";

import { AppRegistry } from "react-native";
import { expo } from "./app.json";

import EmailVerificationScreen from "./screens/EmailVerificationScreen";

//Handling App Crash Cases

const appName = expo.name;

function Loading({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const userVerified = user.emailVerified;
        const uid = user.uid;
        console.log(uid);
        if (userVerified) {
          navigation.replace("DrawerEntry");
        } else {
          navigation.replace("EmailVerification");
        }
      } else {
        // User is signed out
        navigation.replace("LoginWelcome");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator size={"small"} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Loading"
      >
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="LoginWelcome" component={LoginWelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="DrawerEntry" component={DrawerEntryScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Definition" component={DefinitionScreen} />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerificationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
