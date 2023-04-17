import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { SIZES } from "../../constants";
import { globalStyles } from "../../styles";

import { UtilitiesContext } from "../../contexts";

const Settings = () => {
  const theme = useTheme();
  const router = useRouter();

  const { setRefresh } = useContext(UtilitiesContext);

  const [formData, setFormData] = useState({
    apartmentPrice: 0,
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: () => {
            return <Text>Settings</Text>;
          },
        }}
      />
      <View style={globalStyles.main}>
        <View style={globalStyles.container}>
          <View
            style={{
              marginTop: SIZES.large,
            }}
          >
            <Text variant="titleSmall">Apartment Price</Text>
            <TextInput
              keyboardType="number-pad"
              placeholder="0.00"
              value={formData.apartmentPrice || ""}
              onChangeText={(text) =>
                setFormData((prevState) => ({
                  ...prevState,
                  downpayment: text,
                }))
              }
              style={{ backgroundColor: "#fff" }}
              mode="outlined"
              dense
            />
          </View>
        </View>
        <View style={globalStyles.container}>
          <TouchableOpacity onPress={() => {}}>
            <Button style={globalStyles.button.primary(theme.colors.primary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                Save Settings
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
