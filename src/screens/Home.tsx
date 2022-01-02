import { StatusBar } from "expo-status-bar";
import React from "react";
import { Button } from "react-native-paper";
import { Alert, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { firebaseAuth, firestore } from "../config/firebase";
import { HabitItem } from "../components/HabitItem";
import { StyleSheet } from "react-native";
import { Card, FAB, Subheading, Title } from "react-native-paper";
import { useCallback } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { Habit } from "../types";
import { useEffect } from "react";
import { useRef } from "react";
import { parseHabit } from "../utils/parseHabit";

export const homeOptions = ({ navigation }) => ({
  headerRight: () => (
    <Ionicons
      onPress={async () => {
        Alert.alert(
          "Sign out",
          "Do you really want to sign out?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "OK",
              style: "default",
              onPress: async () => {
                await firebaseAuth.signOut();
                navigation.replace("SignIn");
              },
            },
          ],
          {
            cancelable: true,
          }
        );
      }}
      name="log-out-outline"
      size={24}
    />
  ),
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  separator: {
    width: "100%",
    height: 15,
  },
  centerText: {
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 15,
  },
});

const Separator = () => <View style={styles.separator} />;

export const Home = ({ navigation }: ScreenProps<"Home">) => {
  const [habits, setHabits] = useState<Habit[]>([]);

  const handleAddHabitClick = useCallback(() => {
    navigation.navigate("CreateHabit");
  }, [navigation]);

  useEffect(() => {
    const q = query(
      collection(firestore, "habits"),
      where("user", "==", firebaseAuth.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const habits: Habit[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Habit;
        habits.push(parseHabit(doc));
      });
      setHabits(habits);
    });

    return () => {
      unsubscribe();
    };
  }, [setHabits]);

  const renderItem = ({ item }) => (
    <HabitItem
      item={item}
      onPress={() => {
        navigation.navigate("HabitDetail", { id: item.id, title: item.title });
      }}
    />
  );

  const renderEmpty = () => {
    return (
      <Card>
        <Card.Content>
          <Title style={styles.centerText}>No habits</Title>
          <Subheading style={styles.centerText}>
            It looks you don't have any habits created yet. Do you want to
            create one?
          </Subheading>
          <Button
            style={styles.emptyButton}
            mode="contained"
            onPress={handleAddHabitClick}
          >
            Create new habit
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <>
      <View style={styles.container}>
        {habits?.length !== 0 ? (
          <FlatList
            data={habits}
            renderItem={renderItem}
            keyExtractor={({ id }) => id}
            ItemSeparatorComponent={Separator}
          />
        ) : (
          renderEmpty()
        )}
      </View>
      <FAB style={styles.fab} icon="plus" onPress={handleAddHabitClick} />
      <StatusBar style="auto" />
    </>
  );
};
