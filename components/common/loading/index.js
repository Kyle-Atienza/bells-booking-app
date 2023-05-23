import { useState } from "react";
import { View } from "react-native";
import { ActivityIndicator, useTheme } from "react-native-paper";
import { SIZES } from "../../../constants";

export const LoadingScreen = () => {
  const theme = useTheme();

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "#97979769",
        zIndex: 2,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ActivityIndicator
        style={{ marginTop: SIZES.large }}
        animating={true}
        color={theme.colors.primary}
        size="large"
      />
    </View>
  );
};
