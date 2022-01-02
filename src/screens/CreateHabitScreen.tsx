import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button } from "react-native-paper";
import { Alert, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { firebaseAuth, firestore } from "../config/firebase";
import { HabitItem } from "../components/HabitItem";
import { StyleSheet } from "react-native";
import { FAB, TextInput } from "react-native-paper";
import { useCallback } from "react";
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { useEffect } from "react";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  input: {
    marginBottom: 20,
  },
  descriptionInput: {
    minHeight: 150,
  },
});

export const CreateHabitScreen = ({
  navigation,
  route,
}: ScreenProps<"CreateHabitScreen">) => {
  const isEdit = !!route?.params?.id;
  const [title, setTitle] = useState<string>(route?.params?.title);
  const [description, setDescription] = useState<string>(
    route?.params?.description ?? ""
  );
  const [loading, setLoading] = useState<boolean>(false);

  const screenTitle = isEdit ? "Update habit" : "Create habit";
  useEffect(() => {
    navigation.setOptions({ title: screenTitle });
  }, [screenTitle, navigation]);

  const handleAddHabitClick = useCallback(async () => {
    setLoading(true);
    try {
      if (isEdit) {
        const data = {
          title,
          description,
        };
        await updateDoc(doc(firestore, "habits", route?.params?.id), data);
      } else {
        const data = {
          title,
          description,
          user: firebaseAuth.currentUser?.uid,
          completed: [],
          created: serverTimestamp(),
        };
        const docRef = await addDoc(collection(firestore, "habits"), data);
      }
      navigation.pop();
    } catch (e) {
      setLoading(false);
      console.error("Error adding document: ", e);
    }
  }, [navigation, title, description, setLoading]);

  return (
    <>
      <View style={styles.container}>
        <View>
          <TextInput
            placeholder="Walk 8000 steps"
            label="Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
            autoComplete="none"
            style={styles.input}
            textContentType="none"
          />
          <TextInput
            placeholder="I am going to walk at least 8000 steps every day"
            label="Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            autoComplete="none"
            style={[styles.input, styles.descriptionInput]}
            textContentType="none"
            multiline
            numberOfLines={5}
          />
          <Button mode="contained" onPress={handleAddHabitClick}>
            {screenTitle}
          </Button>
        </View>
      </View>
      <StatusBar style="auto" />
    </>
  );
};
