import { StatusBar } from "expo-status-bar";
import {
  arrayRemove,
  arrayUnion,
  deleteDoc,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import moment from "moment";
import { last, length, max, reduce } from "ramda";
import React from "react";
import { useCallback } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  Card,
  FAB,
  Paragraph,
  Portal,
  Provider,
  Subheading,
  Title,
} from "react-native-paper";

import { DetailCalendar } from "../components/DetailCalendar";
import { firestore } from "../config/firebase";
import { Habit, ScreenProps } from "../types";
import { parseHabit } from "../utils/parseHabit";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  cardButtons: {
    marginTop: 15,
    justifyContent: "space-between",
  },
  cardTitle: {
    textAlign: "center",
  },
  cardSubtitle: {
    textAlign: "center",
    marginTop: 15,
  },
  detailedStatsTitle: {
    textAlign: "center",
    marginTop: 20,
  },
  detailCalendarContainer: {
    marginTop: 15,
  },
  stats: {
    marginTop: 15,
  },
});

export const habitDetailOptions = ({ route }) => ({
  title: route.params?.title,
});

export const HabitDetailScreen = ({
  navigation,
  route,
}: ScreenProps<"Home">) => {
  const [habit, setHabit] = useState<Habit | null>(null);

  const screenTitle = habit?.title;
  useEffect(() => {
    navigation.setOptions({ title: screenTitle });
  }, [screenTitle, navigation]);

  useEffect(() => {
    const docRef = doc(firestore, "habits", route.params.id);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      setHabit(parseHabit(doc));
    });

    return () => {
      unsubscribe();
    };
  }, [setHabit]);

  const streaks = [0];
  let streakIndex = 0;
  habit?.completed?.reduce((prevTimestamp, currentTimestamp) => {
    if (
      moment.unix(prevTimestamp).diff(moment.unix(+currentTimestamp), "days") <=
      1
    ) {
      streaks[streakIndex] += 1;
    } else {
      streakIndex++;
      streaks[streakIndex] = 1;
    }
    return currentTimestamp;
  }, moment().unix());

  const percentageSuccessful =
    (100 / (moment().diff(moment.unix(habit?.created), "days") + 1)) *
    length(habit?.completed);

  const handleDonePress = useCallback(async () => {
    const docRef = doc(firestore, "habits", route.params.id);

    await updateDoc(docRef, {
      completed: arrayUnion(new Timestamp(moment().startOf("day").unix(), 0)),
    });
  }, [route?.params?.id]);

  const handleFailPress = useCallback(async () => {
    const docRef = doc(firestore, "habits", route.params.id);

    await updateDoc(docRef, {
      completed: arrayRemove(new Timestamp(moment().startOf("day").unix(), 0)),
    });
  }, [route?.params?.id]);

  const handlePressDelete = useCallback(async () => {
    Alert.alert(
      "Delete",
      "Do you really want to delete this habbit?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          style: "default",
          onPress: async () => {
            const docRef = doc(firestore, "habits", route?.params?.id);

            await deleteDoc(docRef);
            navigation.pop();
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }, [route?.params?.id, navigation]);

  const handlePressEdit = () => {
    if (habit) {
      navigation.navigate("CreateHabit", habit);
    }
  };

  const isCompletedToday = habit?.completed?.includes(
    moment().startOf("day").unix()
  );

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Card>
            <Card.Content>
              <Title style={styles.cardTitle}>{habit?.title}</Title>
              <Subheading style={styles.cardSubtitle}>
                {isCompletedToday ? "It is done." : "Done for today?"}
              </Subheading>
            </Card.Content>
            <Card.Actions style={styles.cardButtons}>
              {isCompletedToday ? (
                <Button
                  mode="outlined"
                  style={{ flex: 1 }}
                  icon="close"
                  onPress={handleFailPress}
                >
                  Undone
                </Button>
              ) : (
                <Button
                  mode={"contained"}
                  style={{ flex: 1 }}
                  icon="check"
                  onPress={handleDonePress}
                >
                  Mark as done
                </Button>
              )}
            </Card.Actions>
          </Card>

          <Title style={styles.detailedStatsTitle}>Detailed stats</Title>
          <View style={styles.detailCalendarContainer}>
            <DetailCalendar completed={habit?.completed} />
          </View>
          <Card style={styles.stats}>
            <Card.Content>
              <Paragraph>Current streak: {last(streaks)} days</Paragraph>
              <Paragraph>
                Longest streak: {reduce(max, -Infinity, streaks)} days
              </Paragraph>
              <Paragraph>
                Percentage successful: {percentageSuccessful.toFixed(2)}%
              </Paragraph>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>

      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? "dots-vertical" : "dots-horizontal"}
            actions={[
              {
                icon: "delete-forever",
                label: "Delete",
                onPress: handlePressDelete,
              },
              {
                icon: "pencil",
                label: "Edit",
                onPress: handlePressEdit,
                small: false,
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </Provider>

      <StatusBar style="auto" />
    </>
  );
};
