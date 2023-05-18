import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { SIZES } from "../../../constants";
import { useRouter } from "expo-router";

export const UserCard = ({ user }) => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push(`/settings/user/${user.id}`)}>
      <View
        style={{
          flexGrow: 1,
          padding: SIZES.large,
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: SIZES.xSmall,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text
            variant="headlineSmall"
            style={{ color: theme.colors.primary, fontWeight: 700 }}
          >
            {user.name}
          </Text>
          {user.type === "admin" ? (
            <View
              style={{
                backgroundColor: theme.colors.primary,
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 100,
              }}
            >
              <Text
                variant="labelMedium"
                style={{
                  color: theme.colors.primaryContainer,
                  fontWeight: 700,
                }}
              >
                Admin
              </Text>
            </View>
          ) : null}
        </View>
        <Text variant="bodyLarge" style={{ color: theme.colors.primary }}>
          {user.email}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
