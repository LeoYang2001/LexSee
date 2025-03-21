// In App.js in a new project
import "./gesture-handler";
import * as React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { auth } from "./firebase";
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
import { Provider } from "react-redux";
import store from "./store";
import InventoryScreen from "./screens/inventory/InventoryScreen";
import StoryScreen from "./screens/inventory/story/StoryScreen";
import LanguageSelectionScreen from "./screens/languageSelection/LanguageSelectionScreen";
import ImageGalleryScreen from "./screens/imageGallery/ImageGalleryScreen";

//Handling App Crash Cases

const appName = expo.name;

function Loading({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const userVerified = user.emailVerified;
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
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#191D24",
      }}
    >
      <ActivityIndicator size={"small"} color={"#F54A14"} />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <Provider store={store}>
      <GestureHandlerRootView>
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
            <Stack.Screen name="WordSearch" component={WordSearchScreen} />
            <Stack.Screen name="Definition" component={DefinitionScreen} />
            <Stack.Screen
              name="EmailVerification"
              component={EmailVerificationScreen}
            />
            <Stack.Screen name="Inventory" component={InventoryScreen} />
            <Stack.Screen name="Story" component={StoryScreen} />
            <Stack.Screen
              name="LanguageSelection"
              component={LanguageSelectionScreen}
            />
            <Stack.Screen name="ImageGallery" component={ImageGalleryScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
}

AppRegistry.registerComponent(appName, () => App);

export default App;
