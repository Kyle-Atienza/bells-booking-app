import React, { useCallback, useContext, useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";
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
import { DateTime } from "luxon";

export const Inquiries = ({ header, filteredByDate, hide, limit }) => {
  const theme = useTheme();
  const router = useRouter();

  const { refresh, setRefresh } = useContext(UtilitiesContext);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);

  const fetchData = () => {
    setisLoading(true);
    getInquiries()
      .then((res) => {
        const innerData = res.data.data.rows;

        if (filteredByDate) {
          const filteredDateDateIds = filteredByDate?.schedules[
            filteredByDate.selectedDate
          ]?.periods.map((period) => {
            return period.id;
          });
          setData(
            filteredDateDateIds?.reduce((dayData, scheduleId) => {
              dayData.push(
                innerData.find((item) => {
                  return item.id == scheduleId;
                })
              );
              return dayData;
            }, []) || []
          );
        } else {
          setData(innerData);
        }

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
      data?.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          DateTime.fromISO(item.apt_date_to)
            .toFormat("LLLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          DateTime.fromISO(item.apt_date_from)
            .toFormat("LLLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          DateTime.fromISO(item.apt_date_to)
            .toFormat("LLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          DateTime.fromISO(item.apt_date_from)
            .toFormat("LLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          DateTime.fromISO(item.event_date)
            .toFormat("LLLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          DateTime.fromISO(item.event_date)
            .toFormat("LLL dd yyyy")
            .toLowerCase()
            .includes(search.toLowerCase())
      )
    );
  }, [search]);

  useEffect(() => {
    if (refresh) {
      fetchData();
    }
    setRefresh(false);
  }, [refresh]);

  const visibleData = () => {
    if (!search) {
      if (!limit) {
        return data;
      }

      return hide
        ? data.slice(0, limit).filter((item) => !hide(item))
        : data.slice(0, limit);
    }
    return hide ? searchResults.filter((item) => hide(item)) : searchResults;
  };

  const onRefresh = useCallback(() => {
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 2000);
  }, []);

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
          <>
            <TextInput
              label="Enter name or date"
              value={search}
              onChangeText={(text) => setSearch(text)}
              style={{ backgroundColor: "#fff", flex: 1 }}
              mode="outlined"
              dense
            />
            {/* <TouchableOpacity
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
            </TouchableOpacity> */}
          </>
        </View>
      </>
    );
  };

  const renderItem = (item) => {
    return isLoading ? (
      <ActivityIndicator
        style={{ marginTop: SIZES.large }}
        animating={true}
        color={theme.colors.primary}
      />
    ) : !data.length ? (
      <Text style={{ textAlign: "center" }}>
        You don't have any inquiries {filteredByDate ? "today" : ""}
      </Text>
    ) : !item ? null : (
      <TouchableOpacity onPress={() => router.push(`/inquiry/${item.id}`)}>
        <ScheduleCard data={item} />
      </TouchableOpacity>
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
          data={!isLoading && data.length ? visibleData() : [{}]}
          renderItem={({ item }) => {
            return renderItem(item);
          }}
          keyExtractor={(item) => item?.id || "temp"}
          contentContainerStyle={{
            rowGap: SIZES.large,
            paddingBottom: 50,
          }}
          ListHeaderComponent={headerComponent()}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
          }
        />
      </View>
    </View>
  );
};
