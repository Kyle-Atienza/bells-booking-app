import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

import { SIZES } from "../../constants";
import { globalStyles } from "../../styles";

import { Logo } from "../../assets/images";
import { login } from "../../services/auth";

import { UtilitiesContext } from "../../contexts";
import { LoadingScreen } from "../../components/common";

const Login = () => {
  const theme = useTheme();
  const router = useRouter();

  const { setRefresh } = useContext(UtilitiesContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameEmail: "",
    password: "",
  });

  const onLogin = () => {
    setIsLoading(true);
    login({
      email: formData.usernameEmail.toLowerCase(),
      password: formData.password,
    })
      .then((res) => {
        setFormData({
          usernameEmail: "",
          password: "",
        });

        const toStore = [
          ["@accessToken", res.data.data.access_token],
          ["@userType", res.data.data.me.type],
        ];

        AsyncStorage.multiSet(toStore)
          .then((res) => {
            router.push("/");
            setRefresh(true);

            setIsLoading(false);
          })
          .catch((e) => {
            console.log(e);
            setIsLoading(false);
          });
      })
      .catch((e) => {
        console.log(e);
        alert(e.response.data.message);
        setIsLoading(false);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: () => {
            return "";
          },
          headerShown: false,
        }}
      />
      <View style={globalStyles.main}>
        {isLoading ? <LoadingScreen /> : null}
        <View style={{ ...globalStyles.container, marginTop: 80 }}>
          <View style={{ marginTop: SIZES.large, alignItems: "center" }}>
            <Image style={{ width: 110, height: 110 }} source={Logo} />
          </View>
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Email or Username</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Enter Email or Username"
              value={formData.usernameEmail}
              onChangeText={(text) =>
                setFormData((prevState) => ({
                  ...prevState,
                  usernameEmail: text,
                }))
              }
              style={{ backgroundColor: "#fff" }}
              mode="outlined"
              dense
            />
          </View>
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Password</Text>
            <TextInput
              autoCapitalize="none"
              placeholder="Enter Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prevState) => ({
                  ...prevState,
                  password: text,
                }))
              }
              style={{ backgroundColor: "#fff" }}
              mode="outlined"
              dense
              secureTextEntry={true}
            />
          </View>
          <TouchableOpacity style={{ marginTop: 40 }} onPress={onLogin}>
            <Button style={globalStyles.button.primary(theme.colors.primary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                Login
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
