import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { SIZES } from "../../constants";
import { globalStyles } from "../../styles";

import { UtilitiesContext } from "../../contexts";
import { updateConfigurations } from "../../services/configuration";
import { LoadingScreen } from "../../components/common";
import { useEffect } from "react";

const Settings = () => {
  const theme = useTheme();
  const router = useRouter();

  const { setRefresh, configurations, setConfigurations } =
    useContext(UtilitiesContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    APARTMENT_PRICE: null,
  });

  const onSubmit = (name) => {
    if (!formData[name] || !parseFloat(formData[name])) {
      alert("Invalid value");
    }

    if (parseFloat(formData[name]) === parseFloat(configurations[name])) {
      alert("Please enter another value");
    }

    Alert.alert(
      "Confirm",
      `Are you sure you want to update ${name}?`,
      [
        {
          text: "OK",
          onPress: () => {
            setIsLoading(true);
            updateConfigurations({
              key: name,
              value: formData[name],
            })
              .then((res) => {
                setRefresh(true);
                setIsLoading(false);
              })
              .catch((e) => {
                console.log(e);

                setIsLoading(false);
              });
          },
          style: "default",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  useEffect(() => {});

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
        {isLoading ? <LoadingScreen /> : null}
        <View style={globalStyles.container}>
          <Text variant="titleLarge">Apartment</Text>
          <View
            style={{
              marginTop: SIZES.xSmall,
            }}
          >
            <Text variant="titleSmall">Apartment Price</Text>
            <View style={{ flexDirection: "row", gap: SIZES.large }}>
              <TextInput
                keyboardType="number-pad"
                placeholder="0.00"
                value={
                  formData.APARTMENT_PRICE ||
                  configurations.APARTMENT_PRICE ||
                  ""
                }
                onChangeText={(text) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    APARTMENT_PRICE: text,
                  }))
                }
                style={{ backgroundColor: "#fff", flex: 1 }}
                mode="outlined"
                dense
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: SIZES.medium,
                }}
                onPress={() => onSubmit("APARTMENT_PRICE")}
              >
                <IconButton
                  icon="content-save"
                  iconColor={theme.colors.primary}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={globalStyles.container}>
          <Text variant="titleLarge">Event</Text>
          <View
            style={{
              marginTop: SIZES.xSmall,
            }}
          >
            <Text variant="titleSmall">Event Base Price</Text>
            <View style={{ flexDirection: "row", gap: SIZES.large }}>
              <TextInput
                keyboardType="number-pad"
                placeholder="0.00"
                value={
                  formData.EVENT_BASE_PRICE ||
                  configurations.EVENT_BASE_PRICE ||
                  ""
                }
                onChangeText={(text) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    EVENT_BASE_PRICE: text,
                  }))
                }
                style={{ backgroundColor: "#fff", flex: 1 }}
                mode="outlined"
                dense
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: SIZES.medium,
                }}
                onPress={() => onSubmit("EVENT_BASE_PRICE")}
              >
                <IconButton
                  icon="content-save"
                  iconColor={theme.colors.primary}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: SIZES.large,
            }}
          >
            <Text variant="titleSmall">Apartment Add on Price</Text>
            <View style={{ flexDirection: "row", gap: SIZES.large }}>
              <TextInput
                keyboardType="number-pad"
                placeholder="0.00"
                value={
                  formData.APARTMENT_ADDON_PRICE ||
                  configurations.APARTMENT_ADDON_PRICE ||
                  ""
                }
                onChangeText={(text) =>
                  setFormData((prevState) => ({
                    ...prevState,
                    APARTMENT_ADDON_PRICE: text,
                  }))
                }
                style={{ backgroundColor: "#fff", flex: 1 }}
                mode="outlined"
                dense
              />
              <TouchableOpacity
                style={{
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: SIZES.medium,
                }}
                onPress={() => onSubmit("APARTMENT_ADDON_PRICE")}
              >
                <IconButton
                  icon="content-save"
                  iconColor={theme.colors.primary}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <View style={globalStyles.container}>
          <TouchableOpacity onPress={() => onSubmit()}>
            <Button style={globalStyles.button.primary(theme.colors.primary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                Save Settings
              </Text>
            </Button>
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
};

export default Settings;
