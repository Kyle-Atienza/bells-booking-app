import { Stack } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { MD3LightTheme, Provider as PaperProvider } from "react-native-paper";
import { UtilitiesContext } from "../contexts";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#0097B2",
    secondary: "#0FB60B",
    primaryContainer: "#E9F7FF",
  },
};

const Layout = () => {
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
