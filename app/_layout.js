import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Drawer } from "expo-router/drawer";
import {
  MD3LightTheme,
  Provider as PaperProvider,
  Provider,
  Text,
} from "react-native-paper";
import { UtilitiesContext } from "../contexts";

import { DrawerContent } from "../components/drawer";
import { useAuth } from "../hooks";
import { getConfigurations } from "../services/configuration";

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

  const { loggedIn } = useAuth();

  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [configurations, setConfigurations] = useState({});

  const initializeConfigurations = () => {
    getConfigurations()
      .then((res) => {
        setConfigurations(() => {
          return res.data.data.reduce((updated, config) => {
            updated[config.key] = config.value;
            return updated;
          }, {});
        });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (loggedIn) {
      router.push("/");
      initializeConfigurations();
    }
  }, [loggedIn]);

  useEffect(() => {
    initializeConfigurations();
  }, []);

  useEffect(() => {
    initializeConfigurations();
    setRefresh(false);
  }, [refresh]);

  return (
    <UtilitiesContext.Provider
      value={{
        refresh,
        setRefresh,
        configurations,
        setConfigurations,
        isLoading,
        setIsLoading,
      }}
    >
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
