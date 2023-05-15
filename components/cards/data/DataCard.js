import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import { SIZES } from "../../../constants";

export const DataCard = ({ variant = "primary", value, label }) => {
  const theme = useTheme();
  const [defaultStyles, setDefaultStyles] = useState({
    color: undefined,
  });

  useEffect(() => {
    switch (variant) {
      case "primary":
        setDefaultStyles({
          color: theme.colors.secondary,
        });
        break;
      case "secondary":
        setDefaultStyles({
          color: theme.colors.primary,
        });
        break;

      default:
        break;
    }
  }, []);

  return (
    <View
      style={{
        flexGrow: 1,
        padding: SIZES.large,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: SIZES.xSmall,
        alignItems: "center",
      }}
    >
      <Text
        variant="displaySmall"
        style={{ color: defaultStyles.color, fontWeight: 700 }}
      >
        {value || 0}
      </Text>
      <Text variant="labelLarge">{label || "Label"}</Text>
    </View>
  );
};
