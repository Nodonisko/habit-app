import { StatusBar } from "expo-status-bar";
import React from "react";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput, HelperText } from "react-native-paper";
import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  User,
} from "firebase/auth";

import { ScreenProps } from "../types";
import { firebaseAuth, firebaseInstance } from "../config/firebase";
import { FirebaseError } from "firebase/app";
import { parseError } from "../utils/parseAuthError";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    width: "100%",
    padding: 15,
  },
  input: {
    marginTop: 20,
  },
  submit: {},
  error: {
    marginVertical: 25,
    textAlign: "center",
  },
});

export function SignIn({ navigation }: ScreenProps<"SignIn">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState<FirebaseError | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const passwordInputRef = useRef<TextInput>(null);

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      console.log("user state changed");
      if (user) {
        setUser(user);
        navigation.replace("Home");
        console.log("User is signed in: ", user.uid);
      } else {
        setUser(null);
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigation]);

  const handleSubmit = useCallback(async () => {
    signInWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log("signed in");
        setError(null);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      });
  }, [email, password]);

  const handleSignUp = useCallback(() => {
    navigation.navigate("SignUp");
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          placeholder="jonh.doe@gmail.com"
          label="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoComplete="email"
          style={styles.input}
          keyboardType="email-address"
          autoCorrect={false}
          spellCheck={false}
          textContentType="emailAddress"
          autoCapitalize="none"
          onSubmitEditing={() => {
            passwordInputRef?.current?.focus?.();
          }}
        />
        <TextInput
          placeholder="*******"
          label="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          autoComplete="password"
          style={styles.input}
          secureTextEntry
          textContentType="password"
          onSubmitEditing={handleSubmit}
          ref={passwordInputRef}
        />
        <HelperText
          type="error"
          visible={!!error}
          onPressIn={() => {}}
          onPressOut={() => {}}
          style={styles.error}
        >
          {parseError(error)}
        </HelperText>
        <Button mode="contained" onPress={handleSubmit} style={styles.submit}>
          Sign in
        </Button>
        <Button onPress={handleSignUp} style={styles.submit}>
          Don't have account? Sign up.
        </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
