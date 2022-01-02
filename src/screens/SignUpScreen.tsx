import { StatusBar } from "expo-status-bar";
import { FirebaseError } from "firebase/app";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useRef } from "react";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";

import { firebaseAuth } from "../config/firebase";
import { ScreenProps } from "../types";
import { parseError } from "../utils/parseAuthError";

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
    width: "100%",
  },
  submit: {},
  error: {
    marginVertical: 25,
    textAlign: "center",
  },
});

export function SignUp({ navigation }: ScreenProps<"SignUp">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [error, setError] = React.useState<FirebaseError | null>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordRepeatInputRef = useRef<TextInput>(null);

  const handleSubmit = useCallback(async () => {
    if (repeatPassword !== password) {
      setError({
        code: "passwords-doesnt-match",
        message: "Passwords doesn't match.",
      });

      return;
    }

    createUserWithEmailAndPassword(firebaseAuth, email, password)
      .then((userCredential) => {
        console.log("signed in");
      })
      .catch((err) => {
        console.log("Error", err.message, JSON.stringify(err));
        setError(err);
      });
  }, [email, password, repeatPassword]);

  const handleSignIn = useCallback(() => {
    navigation.navigate("SignIn");
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
          autoComplete="password-new"
          style={styles.input}
          secureTextEntry
          textContentType="newPassword"
          onSubmitEditing={() => {
            passwordRepeatInputRef?.current?.focus?.();
          }}
        />
        <TextInput
          placeholder="*******"
          label="Repeat password"
          value={repeatPassword}
          onChangeText={(text) => setRepeatPassword(text)}
          autoComplete="password-new"
          style={styles.input}
          secureTextEntry
          textContentType="newPassword"
          onSubmitEditing={handleSubmit}
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
          Create account
        </Button>
        <Button onPress={handleSignIn} style={styles.submit}>
          Already have account? Sign in.
        </Button>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}
