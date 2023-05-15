import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { getStats } from "../services/stats";
import { UtilitiesContext } from "../contexts";

const Dashboard = () => {
  const theme = useTheme();
  const router = useRouter();

  const { refresh } = useContext(UtilitiesContext);

  const [inquiryModal, setInquiryModal] = React.useState({
    visible: false,
  });
  const [stats, setStats] = useState({});

  useEffect(() => {
    console.log("stats");

    getStats()
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [refresh]);

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
          limit={5}
          hide={(item) => parseFloat(item.balance) === 0}
          header={
            <>
              <View>
                <Statistics data={stats} />
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
