import { useContext, useState } from "react";
import { Alert, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  Checkbox,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { SCHEDULE_OPTIONS, SIZES } from "../../../constants";
import { checkInputLimit } from "../../../helpers/typeHelper";
import { globalStyles } from "../../../styles";

import { DatePicker } from "./DatePicker";
import { DateRangePicker } from "./DateRangePicker";
import { EventPicker } from "./EventPicker";
import { useEffect } from "react";
import { UtilitiesContext } from "../../../contexts";
import { updateInquiry } from "../../../services";

export const InquiryInformation = ({
  inquiryType,
  formData,
  setFormData,
  newInquiry,
  inquiryId,
}) => {
  const theme = useTheme();

  const { setIsLoading, refresh } = useContext(UtilitiesContext);

  const [eventPicker, setEventPicker] = useState(false);
  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  useEffect(() => {
    setDropdown(false);
    setTimeout(() => {
      setDropdown(true);
    }, 100);
  }, [refresh]);

  const dateInput = () => {
    if (inquiryType) {
      if (inquiryType === "event") {
        return (
          <DatePicker
            date={formData.date}
            setDate={(date) =>
              setFormData((prevState) => ({
                ...prevState,
                date: date,
              }))
            }
            reschedule={!newInquiry}
            inquiryId={inquiryId}
          />
        );
      } else if (inquiryType === "apartment") {
        return (
          <DateRangePicker
            range={formData.range}
            setRange={(dates) => {
              setFormData((prevState) => ({
                ...prevState,
                range: dates,
              }));
            }}
            reschedule={!newInquiry}
            inquiryId={inquiryId}
          />
        );
      }
    }
  };

  const optionsLabel = () => {
    if (inquiryType) {
      if (inquiryType === "event") {
        return <Text variant="titleMedium">Add on:</Text>;
      } else if (inquiryType === "apartment") {
        return (
          <View style={{ flexDirection: "row", gap: 5, alignItems: "center" }}>
            <Text variant="titleMedium"># of Apartments</Text>
            {required()}
          </View>
        );
      }
    }
  };

  const required = () => {
    return (
      <Text style={{ color: theme.colors.error }} variant="labelSmall">
        *
      </Text>
    );
  };

  return (
    <>
      <EventPicker
        visible={eventPicker}
        hideModal={() => setEventPicker(false)}
        onSelect={(option) =>
          setFormData((prevState) => ({
            ...prevState,
            eventType: option,
          }))
        }
      />
      <View style={globalStyles.container}>
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Name {required()}</Text>
          <TextInput
            label="Enter customer name"
            value={formData.name || ""}
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                name: text,
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Number {required()}</Text>
          <TextInput
            label="Enter customer number"
            value={formData.number || ""}
            keyboardType="number-pad"
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                number: text,
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
        {inquiryType === "event" ? (
          <>
            <View style={{ marginTop: SIZES.large }}>
              <Text variant="titleSmall">Event Type {required()}</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: SIZES.large,
                    flex: 1,
                  }}
                >
                  <TextInput
                    value={formData.eventType || ""}
                    label={"Type of Event"}
                    style={{ backgroundColor: "#fff", flex: 1 }}
                    mode="outlined"
                    dense
                    onChangeText={(text) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        eventType: text,
                      }))
                    }
                  />
                </View>

                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: SIZES.medium,
                  }}
                  onPress={() => setEventPicker(true)}
                >
                  <IconButton
                    icon="menu"
                    iconColor={theme.colors.primary}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: SIZES.large }}>
              <Text variant="titleSmall">With Catering {required()}</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}></View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={
                    formData.withCatering === true ? "checked" : "unchecked"
                  }
                  onPress={() =>
                    setFormData((prevState) => ({
                      ...prevState,
                      withCatering: true,
                    }))
                  }
                />
                <Text variant="bodyLarge">Yes</Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Checkbox
                  status={
                    formData.withCatering === false ? "checked" : "unchecked"
                  }
                  onPress={() =>
                    setFormData((prevState) => ({
                      ...prevState,
                      withCatering: false,
                    }))
                  }
                />
                <Text variant="bodyLarge">No</Text>
              </View>
            </View>
          </>
        ) : null}
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Date {required()}</Text>
          {dateInput()}
        </View>
        <View style={{ marginTop: SIZES.large }}>
          {inquiryType === "event" && dropdown ? (
            <>
              <Text variant="titleSmall">Schedule {required()}</Text>
              <DropDown
                label="Time from and to"
                mode={"outlined"}
                visible={showScheduleDropdown}
                showDropDown={() => setShowScheduleDropdown(true)}
                onDismiss={() => setShowScheduleDropdown(false)}
                value={formData.schedule}
                setValue={(text) => {
                  if (newInquiry) {
                    setFormData((prevState) => ({
                      ...prevState,
                      schedule: text,
                    }));
                  } else {
                    const schedule = text.split(" to ");

                    Alert.alert(
                      "Confirm",
                      "Confirm reschedule inquiry?",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            setIsLoading(true);
                            updateInquiry({
                              id: inquiryId,
                              data: {
                                event_time_from: schedule[0],
                                event_time_to: schedule[1],
                              },
                            })
                              .then((res) => {
                                const data = res.data.data;

                                setFormData((prevState) => ({
                                  ...prevState,
                                  schedule: `${data.event_time_from} to ${data.event_time_to}`,
                                }));
                                setIsLoading(false);
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
                  }
                }}
                list={SCHEDULE_OPTIONS}
                style={{ backgroundColor: "#fff" }}
              />
            </>
          ) : null}
        </View>
        <View style={{ marginTop: SIZES.large }}>
          <Text variant="titleSmall">Estimated Pax {required()}</Text>
          <TextInput
            label="Approximate number of persons"
            placeholder="0"
            keyboardType="number-pad"
            value={formData.estPax || ""}
            onChangeText={(text) =>
              setFormData((prevState) => ({
                ...prevState,
                estPax: text,
              }))
            }
            style={{ backgroundColor: "#fff" }}
            mode="outlined"
            dense
          />
        </View>
      </View>
      <View
        style={globalStyles.container}
        pointerEvents={!newInquiry ? "none" : "auto"}
      >
        {inquiryType ? (
          <>
            {optionsLabel()}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: SIZES.small,
              }}
            >
              <TextInput
                keyboardType="number-pad"
                value={formData.apartmentCount?.toString() || ""}
                onChangeText={(text) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    apartmentCount: checkInputLimit(text, 2),
                  }))
                }
                placeholder="0"
                style={{ backgroundColor: "#fff" }}
                mode="outlined"
                dense
              />
              <Text variant="titleMedium">
                Apartment(s) <Text style={{ color: "#a0a0a0" }}>(Max 2)</Text>
              </Text>
            </View>
          </>
        ) : (
          <ActivityIndicator
            style={{ marginTop: SIZES.large }}
            animating={true}
            color={theme.colors.primary}
          />
        )}
      </View>
    </>
  );
};
