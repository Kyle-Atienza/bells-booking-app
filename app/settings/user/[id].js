import { Stack, useRouter, useSearchParams } from "expo-router";
import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";
import {
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Checkbox,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { globalStyles } from "../../../styles";
import { SIZES } from "../../../constants";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../../../services/users";
import { UtilitiesContext } from "../../../contexts";
import { LoadingScreen } from "../../../components/common";

const User = () => {
  const theme = useTheme();
  const route = useRouter();

  const { id: userId } = useSearchParams();
  const { refresh, setRefresh, isLoading, setIsLoading, onRefresh } =
    useContext(UtilitiesContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    new: "",
    confirm: "",
  });

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then((res) => {
        const user = res.data.data.find((user) => {
          return user.id === parseInt(userId);
        });

        setFormData({
          name: user.name,
          email: user.email,
          password: user.password,
        });
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [refresh]);

  const onCreateUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert(
        "Invalid Values",
        "Please provide all values",
        [
          {
            text: "OK",
          },
        ],
        {
          cancelable: true,
        }
      );
    } else {
      Alert.alert(
        "Create New User",
        `Are you sure you want to create ${formData.name} an account?`,
        [
          {
            text: "OK",
            onPress: () => {
              setIsLoading(true);
              createUser(formData)
                .then((res) => {
                  setFormData({
                    name: null,
                    email: null,
                    password: null,
                  });
                  Alert.alert(
                    "User Created",
                    `Successfully created account`,
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          route.push("/settings/users");
                          setRefresh(true);
                        },
                      },
                    ],
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
          {
            text: "Cancel",
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };

  const onUpdateUser = (data) => {
    if (!formData.name || !formData.email) {
      Alert.alert("Error", "Please provide all values", [
        {
          text: "OK",
        },
      ]);
    } else {
      Alert.alert(
        "Update User",
        "Are you sure you want to update this user?",
        [
          {
            text: "OK",
            onPress: () => {
              setIsLoading(true);
              updateUser({
                id: userId,
                data: data,
              })
                .then((res) => {
                  setIsLoading(false);
                  setFormData({
                    name: res.data.data.name,
                    email: res.data.data.email,
                    password: "",
                  });
                  setPasswordForm({
                    new: "",
                    confirm: "",
                  });
                  Alert.alert(
                    "Updated User",
                    "User has been updated succefully",
                    [
                      {
                        text: "OK",
                        onPress: () => {
                          setRefresh(true);
                        },
                      },
                    ]
                  );
                })
                .catch((e) => {
                  setIsLoading(false);
                  console.log(e);
                });
            },
          },
          {
            text: "Cancel",
          },
        ],
        {
          cancelable: true,
        }
      );
    }
  };

  const onDeleteUser = () => {
    Alert.alert(
      "Delete User",
      "Are you sure you want to delete this user?",
      [
        {
          text: "OK",
          onPress: () => {
            setIsLoading(true);
            deleteUser(userId)
              .then((res) => {
                setIsLoading(false);
                Alert.alert(
                  "Deleted User",
                  "User has been deleted succefully",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        setRefresh(true);
                        route.push("/settings/users");
                      },
                    },
                  ]
                );
              })
              .catch((e) => {
                setIsLoading(false);
                console.log(e);
              });
          },
        },
        {
          text: "Cancel",
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: () => {
            return <Text>User</Text>;
          },
        }}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View style={globalStyles.main}>
          {isLoading ? <LoadingScreen /> : null}
          <View style={globalStyles.container}>
            <View
              style={{
                marginTop: SIZES.xSmall,
              }}
            >
              <Text variant="titleSmall">Name</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <TextInput
                  placeholder="Enter Name"
                  value={formData.name || ""}
                  onChangeText={(text) =>
                    setFormData((prevState) => ({
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
              <Text variant="titleSmall">Email</Text>
              <View style={{ flexDirection: "row", gap: SIZES.large }}>
                <TextInput
                  placeholder="Enter Email"
                  value={formData.email || ""}
                  onChangeText={(text) =>
                    setFormData((prevState) => ({
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
            {userId === "new" ? (
              <View
                style={{
                  marginTop: SIZES.xSmall,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text variant="titleSmall">Password</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Checkbox
                      status={showPassword ? "checked" : "unchecked"}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                    <Text variant="titleSmall">Show Password</Text>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: SIZES.large }}>
                  <TextInput
                    placeholder="Enter Password"
                    value={formData.password || ""}
                    onChangeText={(text) =>
                      setFormData((prevState) => ({
                        ...prevState,
                        password: text,
                      }))
                    }
                    style={{ backgroundColor: "#fff", flex: 1 }}
                    mode="outlined"
                    dense
                    autoCapitalize="none"
                    secureTextEntry={!showPassword}
                  />
                </View>
              </View>
            ) : null}
          </View>
          <View
            style={{
              ...globalStyles.container,
              flexDirection: "row",
              gap: SIZES.small,
            }}
          >
            {userId === "new" ? (
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => onCreateUser()}
              >
                <Button
                  style={globalStyles.button.primary(theme.colors.secondary)}
                >
                  <Text variant="labelLarge" style={{ color: "#fff" }}>
                    Create User
                  </Text>
                </Button>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => onDeleteUser()}
                >
                  <Button
                    style={{
                      ...globalStyles.button.primary("#B00020"),
                    }}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      Delete User
                    </Text>
                  </Button>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() =>
                    onUpdateUser({
                      name: formData.name,
                      email: formData.email,
                    })
                  }
                >
                  <Button
                    style={{
                      ...globalStyles.button.primary(theme.colors.primary),
                    }}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      Update User
                    </Text>
                  </Button>
                </TouchableOpacity>
              </>
            )}
          </View>
          {userId !== "new" ? (
            <>
              <View style={globalStyles.container}>
                <View
                  style={{
                    marginTop: SIZES.xSmall,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="titleSmall">New Password</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Checkbox
                        status={showPassword ? "checked" : "unchecked"}
                        onPress={() => setShowPassword(!showPassword)}
                      />
                      <Text variant="titleSmall">Show Password</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: SIZES.large }}>
                    <TextInput
                      placeholder="Enter New Password"
                      value={passwordForm.new}
                      onChangeText={(text) =>
                        setPasswordForm((prevState) => ({
                          ...prevState,
                          new: text,
                        }))
                      }
                      style={{ backgroundColor: "#fff", flex: 1 }}
                      mode="outlined"
                      dense
                      autoCapitalize="none"
                      secureTextEntry={!showPassword}
                    />
                  </View>
                </View>
                <View
                  style={{
                    marginTop: SIZES.xSmall,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text variant="titleSmall">Confirm New Password</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Checkbox
                        status={showConfirmPassword ? "checked" : "unchecked"}
                        onPress={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      />
                      <Text variant="titleSmall">Show Password</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: "row", gap: SIZES.large }}>
                    <TextInput
                      placeholder="Confirm New Password"
                      value={passwordForm.confirm}
                      onChangeText={(text) =>
                        setPasswordForm((prevState) => ({
                          ...prevState,
                          confirm: text,
                        }))
                      }
                      style={{ backgroundColor: "#fff", flex: 1 }}
                      mode="outlined"
                      dense
                      autoCapitalize="none"
                      secureTextEntry={!showConfirmPassword}
                    />
                  </View>
                </View>
              </View>
              <View style={globalStyles.container}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => {
                    if (!passwordForm.new || !passwordForm.confirm) {
                      Alert.alert(
                        "Empty Password",
                        "Please make sure that both password are filled up",
                        [
                          {
                            text: "OK",
                          },
                        ],
                        { cancelable: true }
                      );
                    } else {
                      if (passwordForm.new === passwordForm.confirm) {
                        onUpdateUser({
                          password: passwordForm.new,
                        });
                      } else {
                        Alert.alert(
                          "Password did not match",
                          "Please make sure that both passwords match",
                          [
                            {
                              text: "OK",
                            },
                          ],
                          { cancelable: true }
                        );
                      }
                    }
                  }}
                >
                  <Button
                    style={{
                      ...globalStyles.button.primary(theme.colors.primary),
                    }}
                  >
                    <Text variant="labelLarge" style={{ color: "#fff" }}>
                      Update Password
                    </Text>
                  </Button>
                </TouchableOpacity>
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default User;
