// In App.js in a new project
import "./gesture-handler";
import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { app, auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AppRegistry } from "react-native";
import { expo } from "./app.json";
import LoginWelcomeScreen from "./screens/auth/LoginWelcomeScreen";
import SignInScreen from "./screens/auth/SignInScreen";
import SignUpScreen from "./screens/auth/SignUpScreen";
import EmailVerificationScreen from "./screens/auth/EmailVerificationScreen";
import DrawerEntryScreen from "./screens/main/DrawerEntryScreen";
import MainScreen from "./screens/main/MainScreen";
import DefinitionScreen from "./screens/definition/DefinitionScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import WordSearchScreen from "./screens/wordSearch/WordSearchScreen";



  



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
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
            initialRouteName="WordSearch"
          >
            <Stack.Screen name="Loading" component={Loading} />
            <Stack.Screen name="LoginWelcome" component={LoginWelcomeScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="DrawerEntry" component={DrawerEntryScreen} />
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="WordSearch" component={WordSearchScreen} />
            <Stack.Screen name="Definition" component={DefinitionScreen} />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerificationScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
