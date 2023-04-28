import { useState } from "react";
import { View } from "react-native";
import {
  ActivityIndicator,
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
import { useEffect } from "react";

export const InquiryInformation = ({
  inquiryType,
  formData,
  setFormData,
  newInquiry,
}) => {
  const theme = useTheme();

  const [showScheduleDropdown, setShowScheduleDropdown] = useState(false);

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
      <View
        style={globalStyles.container}
        pointerEvents={!newInquiry ? "none" : "auto"}
      >
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
          <Text variant="titleSmall">Date {required()}</Text>
          {dateInput()}
        </View>
        <View style={{ marginTop: SIZES.large }}>
          {inquiryType === "event" ? (
            <>
              <Text variant="titleSmall">Schedule {required()}</Text>
              <DropDown
                label="Time from and to"
                mode={"outlined"}
                visible={showScheduleDropdown}
                showDropDown={() => setShowScheduleDropdown(true)}
                onDismiss={() => setShowScheduleDropdown(false)}
                value={formData.schedule}
                setValue={(text) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    schedule: text,
                  }))
                }
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
