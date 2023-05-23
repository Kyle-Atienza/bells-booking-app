import { Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, SafeAreaView, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { getUsers } from "../../../services/users";
import { globalStyles } from "../../../styles";
import { SIZES } from "../../../constants";
import { UserCard } from "../../../components/cards/users/UserCard";
import { UtilitiesContext } from "../../../contexts";
import { LoadingScreen } from "../../../components/common";

const Users = () => {
  const theme = useTheme();

  const { refresh, setRefresh, isLoading, setIsLoading, onRefresh } =
    useContext(UtilitiesContext);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    getUsers()
      .then((res) => {
        setUsers(res.data.data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, [refresh]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: () => {
            return <Text>Users</Text>;
          },
        }}
      />
      <View style={globalStyles.main}>
        {isLoading ? <LoadingScreen /> : null}
        <View style={globalStyles.container}>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={users}
            renderItem={({ item }) => {
              return <UserCard user={item} />;
            }}
            keyExtractor={(item) => item?.id || Math.floor(Math.random() * 101)}
            contentContainerStyle={{
              rowGap: SIZES.large,
              paddingBottom: 50,
            }}
            refreshControl={
              <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Users;
