import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Chip, IconButton, Text, useTheme } from "react-native-paper";
import { capitalize } from "../../../helpers/typeHelper";

import { DateTime } from "luxon";
import { formatTime } from "../../../helpers/timeHelper";
import { SIZES } from "../../../constants";
import { inquiryStatus } from "../../../helpers/inqiuryHelper";

export const ScheduleCard = ({ data }) => {
  const theme = useTheme();

  const [isPaid, setisPaid] = useState(false);

  useEffect(() => {
    setisPaid(parseFloat(data.balance) === 0);
  }, [data]);

  const cardChips = () => {
    const type = data.type;

    if (type === "apartment") {
      return (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            gap: SIZES.xSmall,
          }}
        >
          <Chip
            style={{
              borderRadius: 100,
              backgroundColor: theme.colors.tertiaryContainer,
            }}
          >
            <Text variant="titleSmall">
              {DateTime.fromISO(data.apt_date_from).toFormat("LLL dd yyyy")}
            </Text>
          </Chip>
          <Text>-</Text>
          <Chip
            style={{
              borderRadius: 100,
              backgroundColor: theme.colors.tertiaryContainer,
            }}
          >
            <Text variant="titleSmall">
              {DateTime.fromISO(data.apt_date_to).toFormat("LLL dd yyyy")}
            </Text>
          </Chip>
        </View>
      );
    } else if (type === "event") {
      return (
        <>
          <Chip
            style={{
              borderRadius: 100,
              backgroundColor: theme.colors.tertiaryContainer,
            }}
          >
            <Text variant="titleSmall">
              {DateTime.fromISO(data.event_date).toFormat("LLL dd")}
            </Text>
          </Chip>
          <Chip
            style={{
              borderRadius: 100,
              backgroundColor: theme.colors.tertiaryContainer,
            }}
          >
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
        backgroundColor: isPaid
          ? theme.colors.secondaryContainer
          : theme.colors.primaryContainer,
        borderRadius: 10,
        flexDirection: "column",
        gap: 10,
      }}
    >
      <View style={{ flexDirection: "column" }}>
        <View style={{ flexDirection: "row" }}>
          <Text variant="titleLarge">{data.name}</Text>
        </View>
        <Text variant="titleSmall">
          <>
            {inquiryStatus(data)}
            {" | "}
            {capitalize(data.type)}
          </>
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          alignSelf: "flex-end",
          flexWrap: "wrap",
          justifyContent: "flex-end",
          marginTop: SIZES.xSmall,
        }}
      >
        {cardChips()}
      </View>
    </View>
  );
};
