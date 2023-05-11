import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export const DrawerContent = () => {
  const router = useRouter();

  const { onLogout } = useAuth();
  const [userType, setUserType] = useState(null);

  AsyncStorage.getItem("@userType")
    .then((res) => {
      setUserType(res);
    })
    .catch((e) => {
      console.log(e);
    });

  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Home"
        onPress={() => router.push("/")}
        icon={() => <Ionicons name="home" size={24} />}
      />
      <DrawerItem
        label="Schedules"
        onPress={() => router.push("schedules/list")}
        icon={() => <Ionicons name="list" size={24} />}
      />
      <DrawerItem
        label="Calendar"
        onPress={() => router.push("schedules/calendar")}
        icon={() => <Ionicons name="calendar" size={24} />}
      />
      {userType === "admin" ? (
        <DrawerItem
          label="Settings"
          onPress={() => router.push("settings")}
          icon={() => <Ionicons name="settings-sharp" size={24} />}
        />
      ) : null}
      <DrawerItem
        label="Logout"
        onPress={onLogout}
        icon={() => <Ionicons name="log-out" size={24} />}
      />
    </DrawerContentScrollView>
  );
};
