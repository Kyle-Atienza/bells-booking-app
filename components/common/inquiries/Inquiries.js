import React, { useContext, useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { globalStyles } from "../../../styles";
import { ScheduleCard } from "../../cards";
import { SIZES } from "../../../constants";
import { useRouter } from "expo-router";
import { getInquiries } from "../../../services";
import { UtilitiesContext } from "../../../contexts";

export const Inquiries = ({ header }) => {
  const theme = useTheme();
  const router = useRouter();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = () => {
    setisLoading(true);
    getInquiries()
      .then((res) => {
        setData(res.data.data.rows);
        setisLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setisLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setSearchResults(
      data.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    if (refresh) {
      fetchData();
    }
    setRefresh(false);
  }, [refresh]);

  const headerComponent = () => {
    return (
      <>
        {header}
        <View
          style={{
            flexDirection: "row",
            gap: SIZES.small,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <TextInput
            label="Enter name, inspection"
            value={search}
            onChangeText={(text) => setSearch(text)}
            style={{ backgroundColor: "#fff", flex: 1 }}
            mode="outlined"
            dense
          />
          <TouchableOpacity
            style={{
              backgroundColor: theme.colors.primaryContainer,
              borderRadius: SIZES.medium,
            }}
            onPress={fetchData}
          >
            <IconButton
              icon="refresh"
              iconColor={theme.colors.primary}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  };

  if (!data)
    return (
      <>
        <View style={globalStyles.container}>
          {headerComponent()}
          <ActivityIndicator
            style={{ marginTop: SIZES.large }}
            animating={true}
            color={theme.colors.primary}
          />
        </View>
      </>
    );

  return (
    <View style={globalStyles.container}>
      <View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={isLoading ? [{}] : searchResults.length ? searchResults : data}
          renderItem={({ item }) => {
            return isLoading ? (
              <ActivityIndicator
                style={{ marginTop: SIZES.large }}
                animating={true}
                color={theme.colors.primary}
              />
            ) : (
              <TouchableOpacity
                onPress={() => router.push(`/inquiry/${item.id}`)}
              >
                <ScheduleCard data={item} />
              </TouchableOpacity>
            );
          }}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            rowGap: SIZES.large,
            paddingBottom: 50,
          }}
          ListHeaderComponent={headerComponent()}
        />
      </View>
    </View>
  );
};
