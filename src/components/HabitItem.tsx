import React, { useMemo } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Badge,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import moment from "moment";
import { Habit } from "../types";
import { colors } from "../utils/colors";

interface HabitItemProps {
  item: Habit;
  onPress?: Function;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    padding: 15,
    flexDirection: "column",
  },
  dayBadges: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  badge: {},
});

export const HabitItem = ({ item, onPress = () => {} }: HabitItemProps) => {
  const { title, description, completed } = item;
  const lastWeek = Array(7)
    .fill(null)
    .map((_, index) => moment().subtract(index, "days"))
    .reverse();

  const badges = lastWeek.map((momentDate) => {
    const isCompleted = completed
      .map((timestamp) =>
        moment
          .unix(+timestamp)
          .startOf("day")
          .toISOString()
      )
      .includes(momentDate.startOf("day").toISOString());

    return {
      isCompleted,
      momentDate,
    };
  });

  return (
    <Card onPress={onPress}>
      <Card.Title title={title} />
      <Card.Content>
        <Paragraph>{description}</Paragraph>
        <Paragraph>Your weekly goals:</Paragraph>
        <Paragraph>
          {badges.filter(({ isCompleted }) => isCompleted).length}/7 completed:
        </Paragraph>
        <View style={styles.dayBadges}>
          {badges.map(({ isCompleted, momentDate }) => (
            <Badge
              key={momentDate.toISOString()}
              style={styles.badge}
              size={30}
              theme={{
                colors: {
                  notification: isCompleted
                    ? colors.greenLight
                    : colors.redLight,
                },
              }}
              onPressIn={() => {}}
              onPressOut={() => {}}
            >
              {momentDate.format("dd")}
            </Badge>
          ))}
        </View>
      </Card.Content>
    </Card>
  );
};
