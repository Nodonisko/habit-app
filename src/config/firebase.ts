import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  initializeAuth,
  onAuthStateChanged,
  setPersistence,
} from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjjeCWn1FmXXFcj4ZFdyGa7GESN-4sWi8",
  authDomain: "upol-xproj.firebaseapp.com",
  projectId: "upol-xproj",
  storageBucket: "upol-xproj.appspot.com",
  messagingSenderId: "1023970756189",
  appId: "1:1023970756189:web:f2d493f4f60edb3e9defb4",
  measurementId: "G-ZZ6QQVGW7H",
};

export const firebaseInstance = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(firebaseInstance, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const firestore = getFirestore(firebaseInstance);
