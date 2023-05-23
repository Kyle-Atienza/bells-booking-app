import React, { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Button, Text, useTheme } from "react-native-paper";
import { globalStyles } from "../../../styles";
import { DataCard } from "../../cards";
import { getStats } from "../../../services/stats";
import { UtilitiesContext } from "../../../contexts";

export const Statistics = ({ data }) => {
  const theme = useTheme();

  const { refresh } = useCallback(UtilitiesContext);

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
        <DataCard label={"Upcoming"} value={data?.upcoming || 0} />
        <DataCard
          label={"Inquiries"}
          value={data?.inquiries || 0}
          variant={"secondary"}
        />
      </View>
    </>
  );
};
