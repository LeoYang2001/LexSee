// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDK15DmgUJJhZJMyZIP7dIobBG-ylZ7R68",
  authDomain: "lexseev2.firebaseapp.com",
  projectId: "lexseev2",
  storageBucket: "lexseev2.appspot.com",
  messagingSenderId: "747657528566",
  appId: "1:747657528566:web:abe81e10eba34e4189d8d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app)

export { app, auth , db};
