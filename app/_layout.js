import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { UtilitiesContext } from "../contexts";
import { AsyncStorage } from "react-native";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0097B2",
    secondary: "#0FB60B",
    primaryContainer: "#E9F7FF",
    secondaryContainer: "#e8f7e8",
    tertiaryContainer: "#efd8ed",
  },
};

const Layout = () => {
  const router = useRouter();

  const [refresh, setRefresh] = useState(false);

  return (
    <UtilitiesContext.Provider value={{ refresh, setRefresh }}>
      <PaperProvider theme={theme}>
        <Stack />
      </PaperProvider>
    </UtilitiesContext.Provider>
  );
};

export default Layout;
