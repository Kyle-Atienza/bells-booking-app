import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { useRouter } from "expo-router";

import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../../hooks";

export const DrawerContent = () => {
  const router = useRouter();

  const { onLogout } = useAuth();

  return (
    <DrawerContentScrollView>
      <DrawerItem
        label="Home"
        onPress={() => router.push("/")}
        icon={() => <Ionicons name="home" size={24} />}
      />
      <DrawerItem
        label="Schedules"
        onPress={() => router.push("schedule")}
        icon={() => <Ionicons name="list" size={24} />}
      />
      <DrawerItem
        label="Calendar"
        onPress={() => router.push("schedules-calendar")}
        icon={() => <Ionicons name="calendar" size={24} />}
      />
      <DrawerItem
        label="Settings"
        onPress={() => router.push("settings")}
        icon={() => <Ionicons name="settings-sharp" size={24} />}
      />
      <DrawerItem
        label="Logout"
        onPress={onLogout}
        icon={() => <Ionicons name="log-out" size={24} />}
      />
    </DrawerContentScrollView>
  );
};
