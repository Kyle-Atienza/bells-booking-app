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

  const { refresh, setRefresh, configurations, setConfigurations } =
    useContext(UtilitiesContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const parseConfigName = (name) => {
    const lowercase = name.toLowerCase().replaceAll("_", " ");
    const capitalized =
      lowercase.slice(0, 1).toUpperCase() + lowercase.slice(1);

    return capitalized;
  };

  const onSubmit = () => {
    Alert.alert(
      "Confirm",
      `Are you sure you want to update`,
      [
        {
          text: "OK",
          onPress: () => {
            setIsLoading(true);
            updateConfigurations(formData)
              .then((res) => {
                setRefresh(true);
                setConfigurations(() => {
                  return res.data.data.reduce((updated, config) => {
                    updated[config.key] = config.value;
                    return updated;
                  }, {});
                });
                setIsLoading(false);

                Alert.alert("Success", "Price successfully updated", [], {
                  cancelable: true,
                });
              })
              .catch((e) => {
                console.log(e);
                setIsLoading(false);

                Alert.alert("Failed", "Price update failed", [], {
                  cancelable: true,
                });
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

  const inputValue = (value) => {
    if (value === "NaN" || !value) {
      return "";
    }

    return parseFloat(value).toString();
  };

  useEffect(() => {
    setFormData(configurations);
  }, []);

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
                value={inputValue(formData.APARTMENT_PRICE)}
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
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
                value={inputValue(formData.EVENT_BASE_PRICE)}
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
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
                value={inputValue(formData.APARTMENT_ADDON_PRICE)}
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
              {/* <TouchableOpacity
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
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
        <View style={globalStyles.container}>
          <TouchableOpacity onPress={() => onSubmit()}>
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
