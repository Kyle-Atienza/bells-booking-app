import { DateTime } from "luxon";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { IconButton, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SIZES } from "../../../constants";

export const DatePicker = ({ date, setDate }) => {
  const theme = useTheme();

  const [open, setOpen] = React.useState(false);

  const onDismissSingle = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirmSingle = React.useCallback(
    (params) => {
      setOpen(false);
      setDate(params.date);
    },
    [setOpen, setDate]
  );

  /* useEffect(() => {
    console.log(date);
  }, [date]); */

  return (
    <>
      <View style={{ flexDirection: "row", gap: SIZES.large }}>
        <View
          pointerEvents="none"
          style={{ flexDirection: "row", gap: SIZES.large, flex: 1 }}
        >
          <TextInput
            value={
              date
                ? DateTime.fromISO(date.toISOString()).toFormat("LLL dd yyyy")
                : null
            }
            label={"When"}
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
        mode="single"
        visible={open}
        onDismiss={onDismissSingle}
        onConfirm={onConfirmSingle}
      />
    </>
  );
};
