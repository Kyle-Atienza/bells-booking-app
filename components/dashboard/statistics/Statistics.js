import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { globalStyles } from "../../../styles";
import { DataCard } from "../../cards";

export const Statistics = () => {
  const theme = useTheme();

  return (
    <>
      <Text variant="titleMedium">Statistics</Text>
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          marginTop: 10,
        }}
      >
        <DataCard label={"Upcoming"} value={56} />
        <DataCard label={"Inquiries"} value={32} variant={"secondary"} />
      </View>
    </>
  );
};
