import React, { useEffect, useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

import { SIZES } from "../../../constants";

import { DateTime } from "luxon";
import { Calendar } from "react-native-calendars";
import { useInquiry } from "../../../hooks";
import { globalStyles } from "../../../styles";
import { useContext } from "react";
import { UtilitiesContext } from "../../../contexts";

export const DateRangePicker = ({ range, setRange }) => {
  const theme = useTheme();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const { schedules } = useInquiry();

  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    setRange({
      startDate: start,
      endDate: end,
    });
  }, [start, end]);

  useEffect(() => {
    setStart(null);
    setEnd(null);
    setRefresh(false);
  }, [refresh]);

  return (
    <>
      {visible ? (
        <Modal visible={visible} animationType="slide">
          <SafeAreaView>
            <View>
              <IconButton
                onPress={() => setVisible(false)}
                icon="arrow-left"
                iconColor={theme.colors.primary}
                size={20}
              />
              <View
                style={{
                  flexDirection: "row",
                  gap: SIZES.small,
                  ...globalStyles.container,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text>From:</Text>
                  <Text variant="headlineSmall">
                    {range.startDate
                      ? DateTime.fromISO(range.startDate).toFormat(
                          "LLL dd yyyy"
                        )
                      : null}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>To:</Text>
                  <Text variant="headlineSmall">
                    {range.endDate
                      ? DateTime.fromISO(range.endDate).toFormat("LLL dd yyyy")
                      : null}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setStart(null);
                  setEnd(null);
                }}
              >
                <Button>Reset</Button>
              </TouchableOpacity>
              <Calendar
                theme={{
                  contentStyle: {
                    backgroundColor: "green",
                  },
                }}
                markingType={"multi-dot"}
                markedDates={schedules}
                minDate={
                  start
                    ? DateTime.fromISO(start).toISODate()
                    : DateTime.fromISO(new Date().toISOString()).toISODate()
                }
                maxDate={end ? DateTime.fromISO(end).toISODate() : null}
                onDayPress={(date) => {
                  if (!start || (start && end)) {
                    setStart(new Date(date.timestamp).toISOString());
                    return;
                  }

                  setEnd(new Date(date.timestamp).toISOString());
                }}
              />
            </View>
          </SafeAreaView>
        </Modal>
      ) : null}
      <View style={{ flexDirection: "row", gap: SIZES.large }}>
        <View
          pointerEvents="none"
          style={{ flexDirection: "row", gap: SIZES.large, flex: 1 }}
        >
          <TextInput
            value={
              range.startDate
                ? DateTime.fromISO(range.startDate).toFormat("LLL dd yyyy")
                : null
            }
            label={"from"}
            style={{ backgroundColor: "#fff", flex: 1 }}
            mode="outlined"
            dense
          />
          <TextInput
            value={
              range.endDate
                ? DateTime.fromISO(range.endDate).toFormat("LLL dd yyyy")
                : null
            }
            label={"to"}
            style={{ backgroundColor: "#fff", flex: 1 }}
            mode="outlined"
            dense
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: SIZES.medium,
          }}
          onPress={() => setVisible(true)}
        >
          <IconButton
            icon="calendar"
            iconColor={theme.colors.primary}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
