import { DateTime } from "luxon";
import React, { useContext, useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, Text, TextInput, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { SIZES } from "../../../constants";
import { Calendar } from "react-native-calendars";
import { useInquiry } from "../../../hooks";
import { globalStyles } from "../../../styles";
import { updateInquiry } from "../../../services";
import { UtilitiesContext } from "../../../contexts";

export const DatePicker = ({
  date,
  setDate,
  reschedule,
  inquiryId,
  ...rest
}) => {
  const theme = useTheme();

  const { schedules } = useInquiry();

  const { setRefresh, isLoading, setIsLoading } = useContext(UtilitiesContext);

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
                  if (reschedule) {
                    Alert.alert(
                      "Confirm Reschedule",
                      "Changing the date will reschedule the inquiry. \n\nAre you sure you want to reschedule this inquiry?",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            setIsLoading(true);
                            setVisible(false);
                            updateInquiry({
                              id: inquiryId,
                              data: {
                                event_date: DateTime.fromISO(
                                  new Date(date.timestamp).toISOString()
                                )
                                  .toFormat("yyyy LL dd")
                                  .replaceAll(" ", "-"),
                              },
                            })
                              .then((res) => {
                                setDate(res.data.data.event_date);
                                setIsLoading(false);
                                setRefresh(true);
                              })
                              .catch((e) => {
                                console.log(e);
                                setIsLoading(false);
                              });
                          },
                          style: "default",
                        },
                      ],
                      {
                        cancelable: true,
                      }
                    );
                  } else {
                    setDate(new Date(date.timestamp).toISOString());
                  }
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
    </>
  );
};
