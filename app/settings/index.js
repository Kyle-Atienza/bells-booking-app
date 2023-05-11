import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import {
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
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
import { createUser } from "../../services/users";

const Settings = () => {
  const theme = useTheme();
  const router = useRouter();

  const { refresh, setRefresh, configurations, setConfigurations } =
    useContext(UtilitiesContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [newUserData, setNewUserData] = useState({
    name: null,
    email: null,
    password: null,
  });

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

  const onCreateUser = () => {
    Alert.alert(
      "Create New User",
      `Are you sure you want to create ${newUserData.name} an account?`,
      [
        {
          text: "OK",
          onPress: () => {
            setIsLoading(true);
            createUser(newUserData)
              .then((res) => {
                setNewUserData({
                  name: null,
                  email: null,
                  password: null,
                });
                Alert.alert(
                  "User Created",
                  `Successfully created account`,
                  [],
                  { cancelable: true }
                );
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
      <ScrollView>
        <View style={globalStyles.main}>
          {isLoading ? <LoadingScreen /> : null}
          <View style={globalStyles.container}>
            <Text variant="titleLarge">Create User</Text>
            <View
              style={{
                marginTop: SIZES.xSmall,
              }}
            >
              <Text variant="titleSmall">New User Name</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <TextInput
                  placeholder="Enter Name"
                  value={newUserData.name || ""}
                  onChangeText={(text) =>
                    setNewUserData((prevState) => ({
                      ...prevState,
                      name: text,
                    }))
                  }
                  style={{ backgroundColor: "#fff", flex: 1 }}
                  mode="outlined"
                  dense
                />
              </View>
            </View>
            <View
              style={{
                marginTop: SIZES.xSmall,
              }}
            >
              <Text variant="titleSmall">New User Email</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <TextInput
                  placeholder="Enter Email"
                  value={newUserData.email || ""}
                  onChangeText={(text) =>
                    setNewUserData((prevState) => ({
                      ...prevState,
                      email: text,
                    }))
                  }
                  style={{ backgroundColor: "#fff", flex: 1 }}
                  mode="outlined"
                  dense
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View
              style={{
                marginTop: SIZES.xSmall,
              }}
            >
              <Text variant="titleSmall">New User Password</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <TextInput
                  placeholder="Enter Password"
                  value={newUserData.password || ""}
                  onChangeText={(text) =>
                    setNewUserData((prevState) => ({
                      ...prevState,
                      password: text,
                    }))
                  }
                  style={{ backgroundColor: "#fff", flex: 1 }}
                  mode="outlined"
                  dense
                  autoCapitalize="none"
                  secureTextEntry={true}
                />
              </View>
            </View>
          </View>
          <View style={globalStyles.container}>
            <TouchableOpacity onPress={() => onCreateUser()}>
              <Button style={globalStyles.button.primary(theme.colors.primary)}>
                <Text variant="labelLarge" style={{ color: "#fff" }}>
                  Create User
                </Text>
              </Button>
            </TouchableOpacity>
          </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;
