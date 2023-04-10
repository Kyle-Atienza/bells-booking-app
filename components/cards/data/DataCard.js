import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, useTheme, Button } from "react-native-paper";
import PropTypes from "prop-types";

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
        padding: 20,
        backgroundColor: theme.colors.primaryContainer,
        borderRadius: 10,
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

DataCard.propTypes = {
  variant: "primary",
};
