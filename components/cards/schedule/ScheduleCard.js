import React from "react";
import { View } from "react-native";
import { Chip, Text, useTheme } from "react-native-paper";
import { capitalize } from "../../../helpers/typeHelper";

import { DateTime } from "luxon";
import { formatTime } from "../../../helpers/timeHelper";

export const ScheduleCard = ({ data }) => {
  const theme = useTheme();

  const cardChips = () => {
    const type = data.type;

    if (type === "apartment") {
      return (
        <>
          <Chip style={{ height: 30, borderRadius: 100 }}>
            <Text variant="titleSmall">
              {DateTime.fromISO(data.apt_date_from).toFormat("LLL dd yyyy")}
            </Text>
          </Chip>
          <Text>-</Text>
          <Chip
            style={{
              height: 30,
              borderRadius: 100,
            }}
          >
            <Text variant="titleSmall">
              {DateTime.fromISO(data.apt_date_to).toFormat("LLL dd yyyy")}
            </Text>
          </Chip>
        </>
      );
    } else if (type === "event") {
      return (
        <>
          <Chip style={{ height: 30, borderRadius: 100 }}>
            <Text variant="titleSmall">
              {DateTime.fromISO(data.event_date).toFormat("LLL dd")}
            </Text>
          </Chip>
          <Chip style={{ height: 30, borderRadius: 100 }}>
            <Text variant="titleSmall">
              {formatTime(data.event_time_from)} to{" "}
              {formatTime(data.event_time_to)}
            </Text>
          </Chip>
        </>
      );
    }
  };

  return (
    <View
      style={{
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 10,
        flexDirection: "column",
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "column" }}>
        <Text variant="titleLarge">{data.name}</Text>
        <Text variant="titleSmall">{capitalize(data.type)}</Text>
        {/* <Text variant="titleSmall">Schedule</Text> */}
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          alignSelf: "flex-end",
        }}
      >
        {cardChips()}
      </View>
    </View>
  );
};
