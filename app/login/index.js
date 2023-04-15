import { Stack, useRouter } from "expo-router";
import React, { useContext, useState } from "react";
import { View, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";
import { SIZES } from "../../constants";
import { globalStyles } from "../../styles";
import { Logo } from "../../assets/images";
import { login } from "../../services/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UtilitiesContext } from "../../contexts";

const Login = () => {
  const theme = useTheme();
  const router = useRouter();

  const { setRefresh } = useContext(UtilitiesContext);

  const [formData, setFormData] = useState({
    usernameEmail: "",
    password: "",
  });

  const onLogin = () => {
    login({
      email: formData.usernameEmail,
      password: formData.password,
    })
      .then((res) => {
        console.log("login", res);

        AsyncStorage.setItem("@accessToken", res.data.data.access_token)
          .then((res) => {
            console.log(res);
            router.push("/");
            setRefresh(true);
          })
          .catch((e) => {
            console.log(e);
          });
      })
      .catch((e) => {
        console.log(e);
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
        }}
      />
      <View style={globalStyles.main}>
        <View style={globalStyles.container}>
          <View style={{ marginTop: SIZES.large, alignItems: "center" }}>
            <Image style={{ width: 110, height: 110 }} source={Logo} />
          </View>
          <View style={{ marginTop: SIZES.large }}>
            <Text variant="titleSmall">Email or Username</Text>
            <TextInput
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
          <TouchableOpacity
            style={{ marginTop: 40 }}
            onPress={() => {
              router.push("/");
              setRefresh(true);
            }}
          >
            <Button style={globalStyles.button.primary(theme.colors.primary)}>
              <Text variant="labelLarge" style={{ color: "#fff" }}>
                Go Home
              </Text>
            </Button>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
