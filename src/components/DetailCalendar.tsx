import moment from "moment";
import React from "react";
import { Calendar } from "react-native-calendars";
import { Timestamp } from "../types";
import { fromPairs } from "ramda";
import { colors } from "../utils/colors";

interface DetailCalendarProps {
  completed?: Timestamp[];
}

export const DetailCalendar = ({ completed = [] }: DetailCalendarProps) => {
  const markedDates = fromPairs(
    completed.map((timestamp) => {
      const date = moment.unix(+timestamp).format("YYYY-MM-DD");
      return [
        date,
        {
          startingDay: true,
          color: colors.greenLight,
          textColor: "black",
          endingDay: true,
        },
      ];
    })
  );

  return (
    <Calendar
      // Enable the option to swipe between months. Default = false
      enableSwipeMonths={true}
      markingType={"period"}
      markedDates={markedDates}
    />
  );
};
