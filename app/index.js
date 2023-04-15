import React, { useEffect, useState } from "react";
import { View, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Button, Text, useTheme } from "react-native-paper";

import { InquiryTypeModal, Statistics } from "../components/dashboard";
import { Inquiries } from "../components/common";
import { globalStyles } from "../styles";

import Ionicons from "@expo/vector-icons/Ionicons";

import { SIZES } from "../constants";
import { useAuth } from "../hooks";
import { logout } from "../services/auth";

const Dashboard = () => {
  const theme = useTheme();
  const router = useRouter();

  const { onLogout } = useAuth();

  const [inquiryModal, setInquiryModal] = React.useState({
    visible: false,
  });

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
                Dashboard
              </Text>
            );
          },
          headerRight: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: SIZES.small,
                }}
              >
                <TouchableOpacity
                  onPress={() => router.push("schedules-calendar")}
                >
                  <Ionicons name="calendar" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={onLogout}>
                  <Ionicons name="log-out-outline" size={24} />
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <InquiryTypeModal
        visible={inquiryModal.visible}
        hideModal={() =>
          setInquiryModal((prevState) => ({
            ...prevState,
            visible: false,
          }))
        }
      />
      <View style={globalStyles.main}>
        <Inquiries
          header={
            <>
              <View>
                <Statistics />
              </View>
              <View style={{ marginTop: SIZES.large }}>
                <TouchableOpacity
                  onPress={() =>
                    setInquiryModal((prevState) => ({
                      ...prevState,
                      visible: true,
                    }))
                  }
                >
                  <Button
                    style={globalStyles.button.primary(theme.colors.secondary)}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      Add Inquiry
                    </Text>
                  </Button>
                </TouchableOpacity>
                <View
                  style={{
                    marginTop: 50,
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Text variant="titleMedium">Inquiries</Text>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                    onPress={() => router.push("schedule")}
                  >
                    <Ionicons name="layers-outline" size={16} />
                    <Text variant="titleMedium">View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Dashboard;
