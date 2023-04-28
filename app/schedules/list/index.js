import { Stack } from "expo-router";
import React from "react";
import { View, SafeAreaView } from "react-native";
import { Text } from "react-native-paper";
import { useTheme } from "react-native-paper";

import { Inquiries } from "../../../components/common";
import { globalStyles } from "../../../styles";

const Schedule = () => {
  const theme = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerTitle: () => {
            return (
              <Text
                style={{ color: theme.colors.primary, fontWeight: 700 }}
                variant="titleLarge"
              >
                Schedule
              </Text>
            );
          },
        }}
      />
      <View style={globalStyles.main}>
        <Inquiries
          header={
            <>
              <Text variant="titleMedium">Inquiries</Text>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Schedule;
