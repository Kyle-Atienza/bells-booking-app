import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { Modal, SafeAreaView, TouchableOpacity, View } from "react-native";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SIZES } from "../../../constants";
import { Calendar } from "react-native-calendars";
import { useInquiry } from "../../../hooks";
import { globalStyles } from "../../../styles";

export const DatePicker = ({ date, setDate, ...rest }) => {
  const theme = useTheme();

  const { schedules } = useInquiry();

  const [visible, setVisible] = useState(false);

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
              <View style={{ ...globalStyles.container }}>
                <Text>Selected: </Text>
                <Text variant="headlineSmall">
                  {date ? DateTime.fromISO(date).toFormat("LLL dd yyyy") : null}
                </Text>
              </View>
              <Calendar
                minDate={DateTime.fromISO(new Date().toISOString()).toISODate()}
                theme={{
                  contentStyle: {
                    backgroundColor: "green",
                  },
                }}
                markingType={"multi-dot"}
                markedDates={{
                  ...schedules,
                  [DateTime.fromISO(date).toISODate()]: {
                    dots: schedules[DateTime.fromISO(date).toISODate()]?.dots,
                    selected: true,
                  },
                }}
                onDayPress={(date) => {
                  setDate(new Date(date.timestamp).toISOString());
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
            value={date ? DateTime.fromISO(date).toFormat("LLL dd yyyy") : null}
            label={"When"}
            style={{ backgroundColor: "#fff", flex: 1 }}
            mode="outlined"
            dense
            {...rest}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: theme.colors.primaryContainer,
            borderRadius: SIZES.medium,
          }}
          onPress={() => setVisible(!visible)}
        >
          <IconButton
            icon="calendar"
            iconColor={theme.colors.primary}
            size={20}
          />
        </TouchableOpacity>
      </View>
      {/* <DatePickerModal
        locale="en"
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
      /> */}
    </>
  );
};
