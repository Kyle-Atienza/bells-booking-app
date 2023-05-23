import { useRouter } from "expo-router";
import { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UtilitiesContext } from "../contexts";
import { logout } from "../services/auth";

export const useAuth = () => {
  const router = useRouter();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const [loggedIn, setLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("@accessToken")
      .then((res) => {
        if (!res) {
          router.push("login");
        } else {
          // router.push("/");
          setAccessToken(res);
          setLoggedIn(true);
        }
        setRefresh(false);
      })
      .catch((e) => {
        console.log(e);
        setLoggedIn(false);
        // router.push("login");
        setRefresh(false);
      });
  }, [refresh]);

  const onLogout = () => {
    logout()
      .then((res) => {
        AsyncStorage.removeItem("@accessToken")
          .then((res) => {
            router.push("login");
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return { loggedIn, onLogout, accessToken };
};
