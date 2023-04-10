import React from "react";
import { View } from "react-native";
import { Checkbox, Text, TextInput, ToggleButton } from "react-native-paper";
import { SIZES } from "../../../constants";

const options = {
  apartment: [
    {
      label: "1 Apartment",
      value: 2000,
    },
    {
      label: "2 Apartments",
      value: 2500,
    },
  ],
  event: [
    {
      label: "1 Apartment",
      value: 1750,
    },
    {
      label: "2 Apartments",
      value: 2350,
    },
  ],
};

export const InquiryOptions = ({ type, selected, setSelected }) => {
  const isChecked = (value) => {
    return value === selected ? "checked" : "unchecked";
  };

  const label = () => {
    if (type === "event") {
      return "Add on:";
    } else if (type === "apartment") {
      return "# of Apartments";
    }
  };

  return (
    <>
      <Text variant="titleMedium">{label()}</Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: SIZES.small }}
      >
        <TextInput
          keyboardType="number-pad"
          placeholder="0"
          style={{ backgroundColor: "#fff" }}
          mode="outlined"
          dense
        />
        <Text variant="titleMedium">Apartment(s)</Text>
      </View>
      {/* <View>
        {options[type].map((item, index) => {
          return (
            <View
              style={{ flexDirection: "row", alignItems: "center" }}
              key={index}
            >
              <Checkbox
                status={isChecked(item.value)}
                onPress={() => {
                  setSelected(item.value);
                }}
              />
              <Text variant="titleSmall">{item.label}</Text>
            </View>
          );
        })}
      </View> */}
    </>
  );
};
