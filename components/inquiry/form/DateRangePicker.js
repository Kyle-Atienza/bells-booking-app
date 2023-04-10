import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SIZES } from "../../../constants";
import { globalStyles } from "../../../styles";
import { DateTime } from "luxon";

export const DateRangePicker = ({ range, setRange }) => {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );

  return (
    <>
      <View style={{ flexDirection: "row", gap: SIZES.large }}>
        <View
          pointerEvents="none"
          style={{ flexDirection: "row", gap: SIZES.large, flex: 1 }}
        >
          <TextInput
            value={
              range.startDate
                ? DateTime.fromISO(range.startDate.toISOString()).toFormat(
                    "LLL dd yyyy"
                  )
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
                ? DateTime.fromISO(range.endDate.toISOString()).toFormat(
                    "LLL dd yyyy"
                  )
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
          onPress={() => setOpen(true)}
        >
          <IconButton
            icon="calendar"
            iconColor={theme.colors.primary}
            size={20}
          />
        </TouchableOpacity>
      </View>
      <DatePickerModal
        locale="en"
        mode="range"
        visible={open}
        onDismiss={onDismiss}
        startDate={range.startDate}
        endDate={range.endDate}
        onConfirm={onConfirm}
      />
    </>
  );
};
