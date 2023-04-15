import { Stack, useRouter } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

import { getInquiries } from "../../services";
import { Inquiries, LoadingScreen } from "../../components/common";

import { DateTime } from "luxon";
import { Calendar } from "react-native-calendars";
import { getDatesInRange } from "../../helpers/scheduleHelper";
import { globalStyles } from "../../styles";
import { UtilitiesContext } from "../../contexts";

function SchedulesCalendar() {
  const theme = useTheme();
  const router = useRouter();

  const { setRefresh } = useContext(UtilitiesContext);

  const [schedules, setSchedules] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    DateTime.fromISO(new Date().toISOString())
      .toFormat("yyyy LL dd")
      .replaceAll(" ", "-")
  );

  useEffect(() => {
    setIsLoading(true);
    getInquiries()
      .then((res) => {
        const innerData = res.data.data.rows;
        const mappedData = innerData.map((data) => {
          if (data.type === "event") {
            return {
              id: data.id,
              startDate: DateTime.fromISO(data.event_date)
                .toFormat("yyyy LL dd")
                .replaceAll(" ", "-"),
            };
          }
          if (data.type === "apartment") {
            return {
              id: data.id,
              startDate: DateTime.fromISO(data.apt_date_from)
                .toFormat("yyyy LL dd")
                .replaceAll(" ", "-"),
              endDate: DateTime.fromISO(data.apt_date_to)
                .toFormat("yyyy LL dd")
                .replaceAll(" ", "-"),
            };
          }
          return data;
        });

        setSchedules(getDatesInRange(mappedData));
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: theme.colors.background },
          headerShadowVisible: false,
          headerTitle: () => {
            return (
              <Text
                style={{ color: theme.colors.primary, fontWeight: 700 }}
                variant="titleLarge"
              >
                Calendar
              </Text>
            );
          },
        }}
      />
      <View style={globalStyles.main}>
        {isLoading ? <LoadingScreen /> : null}
        <Inquiries
          header={
            <Calendar
              initialDate={selectedDate}
              theme={{
                contentStyle: {
                  backgroundColor: "green",
                },
              }}
              markingType="multi-period"
              markedDates={{
                ...schedules,
                [selectedDate]: {
                  periods: [
                    {
                      startingDay: true,
                      endingDay: true,
                      color: "#5f9ea0",
                      indicator: true,
                    },
                  ],
                },
              }}
              onDayPress={(date) => {
                /* setSchedules({
                  ...schedules,
                  [selectedDate]: {
                    periods: schedules[selectedDate].periods.filter(
                      (period) => !period.indicator
                    ),
                  },
                }); */
                setSelectedDate(date.dateString);
                setRefresh(true);

                /* if (schedules[date.dateString]) {
                  setSchedules({
                    ...schedules,
                    [date.dateString]: {
                      periods: [
                        ...schedules[date.dateString].periods,
                        {
                          startingDay: true,
                          endingDay: true,
                          color: "#5f9ea0",
                          indicator: true,
                        },
                      ],
                    },
                  });
                } else {
                  setSchedules((prevState) => ({
                    ...prevState,
                    [date.dateString]: {
                      periods: [
                        {
                          startingDay: true,
                          endingDay: true,
                          color: "#5f9ea0",
                          indicator: true,
                        },
                      ],
                    },
                  }));
                } */
              }}
            />
          }
          filteredByDate={{ selectedDate, schedules }}
        />
      </View>
    </SafeAreaView>
  );
}

export default SchedulesCalendar;
