import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import {
  MD3LightTheme,
  Provider as PaperProvider,
  Text,
} from "react-native-paper";
import { UtilitiesContext } from "../contexts";

import { DrawerContent } from "../components/drawer";

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
        <Drawer
          drawerContent={() => {
            return <DrawerContent />;
          }}
        />
      </PaperProvider>
    </UtilitiesContext.Provider>
  );
  s;
};

export default Layout;
