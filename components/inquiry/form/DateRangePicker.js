import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
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
import { updateInquiry } from "../../../services";

export const DateRangePicker = ({ range, setRange, reschedule, inquiryId }) => {
  const theme = useTheme();

  const { refresh, setRefresh, setIsLoading } = useContext(UtilitiesContext);

  const { schedules } = useInquiry();

  const [visible, setVisible] = useState(false);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

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

  const datePreview = () => {
    if (tempStart || tempEnd) {
      return (
        <>
          <View style={{ flex: 1 }}>
            <Text>From:</Text>
            <Text variant="headlineSmall">
              {tempStart
                ? DateTime.fromISO(tempStart).toFormat("LLL dd yyyy")
                : null}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text>To:</Text>
            <Text variant="headlineSmall">
              {tempEnd
                ? DateTime.fromISO(tempEnd).toFormat("LLL dd yyyy")
                : null}
            </Text>
          </View>
        </>
      );
    } else {
      return (
        <>
          <View style={{ flex: 1 }}>
            <Text>From:</Text>
            <Text variant="headlineSmall">
              {range.startDate
                ? DateTime.fromISO(range.startDate).toFormat("LLL dd yyyy")
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
        </>
      );
    }
  };

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
                {datePreview()}
              </View>
              <Calendar
                theme={{
                  contentStyle: {
                    backgroundColor: "green",
                  },
                }}
                markingType={"multi-dot"}
                markedDates={schedules}
                minDate={
                  reschedule
                    ? tempStart
                      ? DateTime.fromISO(tempStart).toISODate()
                      : DateTime.fromISO(new Date().toISOString()).toISODate()
                    : start
                    ? DateTime.fromISO(start).toISODate()
                    : DateTime.fromISO(new Date().toISOString()).toISODate()
                }
                maxDate={
                  reschedule
                    ? tempEnd
                      ? DateTime.fromISO(tempEnd).toISODate()
                      : null
                    : end
                    ? DateTime.fromISO(end).toISODate()
                    : null
                }
                onDayPress={(date) => {
                  if (reschedule) {
                    if (!tempStart || (tempStart && tempEnd)) {
                      setTempStart(new Date(date.timestamp).toISOString());
                      return;
                    }

                    setTempEnd(new Date(date.timestamp).toISOString());
                  } else {
                    if (!start || (start && end)) {
                      setStart(new Date(date.timestamp).toISOString());
                      return;
                    }

                    setEnd(new Date(date.timestamp).toISOString());
                  }
                }}
              />
              {tempStart || tempEnd || start || end ? (
                <View
                  style={{ ...globalStyles.container, marginTop: SIZES.large }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.primary,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      if (reschedule) {
                        setTempStart(null);
                        setTempEnd(null);
                      } else {
                        setStart(null);
                        setEnd(null);
                      }
                    }}
                  >
                    <Button>
                      <Text style={{ color: "#fff", fontSize: 16 }}>Reset</Text>
                    </Button>
                  </TouchableOpacity>
                </View>
              ) : null}
              {tempStart && tempEnd ? (
                <View
                  style={{ ...globalStyles.container, marginTop: SIZES.small }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: theme.colors.secondary,
                      borderRadius: 5,
                    }}
                    onPress={() => {
                      Alert.alert(
                        "Confirm",
                        "Confirm reschedule inquiry?",
                        [
                          {
                            text: "OK",
                            onPress: () => {
                              setIsLoading(true);
                              setVisible(false);
                              updateInquiry({
                                id: inquiryId,
                                data: {
                                  apt_date_from: DateTime.fromISO(tempStart)
                                    .toFormat("yyyy LL dd")
                                    .replaceAll(" ", "-"),
                                  apt_date_to: DateTime.fromISO(tempEnd)
                                    .toFormat("yyyy LL dd")
                                    .replaceAll(" ", "-"),
                                },
                              })
                                .then((res) => {
                                  const data = res.data.data;

                                  setStart(
                                    new Date(data.apt_date_from).toISOString()
                                  );
                                  setEnd(
                                    new Date(data.apt_date_to).toISOString()
                                  );
                                  setTempStart(null);
                                  setTempEnd(null);
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
                          {
                            text: "Cancel",
                          },
                        ],
                        { cancelable: true }
                      );
                    }}
                  >
                    <Button>
                      <Text style={{ color: "#fff", fontSize: 16 }}>
                        Reschedule
                      </Text>
                    </Button>
                  </TouchableOpacity>
                </View>
              ) : null}
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
