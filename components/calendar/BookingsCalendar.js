import React, { useEffect } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { getInquiries } from "../../services";
import { UtilitiesContext } from "../../contexts";

function BookingsCalendar({ setIsLoading, onFetch, ...rest }) {
  const { setRefresh } = useContext(UtilitiesContext);

  useEffect(() => {
    setIsLoading(true);
    getInquiries()
      .then((res) => {
        onFetch(res);
        /* const innerData = res.data.data.rows;
        const mappedData = innerData.map((data) => {
          if (data.type === "event") {
            return {
              id: data.id,
              startDate: DateTime.fromISO(data.event_date)
                .toFormat("yyyy LL dd")
                .replaceAll(" ", "-"),
              status: inquiryStatus(data),
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
              status: inquiryStatus(data),
            };
          }

          return data;
        });

        setSchedules(getDatesInRange(mappedData));
        setIsLoading(false); */
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(false);
      });
  }, []);

  return (
    <Calendar
      theme={{
        contentStyle: {
          backgroundColor: "green",
        },
      }}
      markingType={"multi-dot"}
      {...rest}
      /* initialDate={selectedDate}
      markedDates={{s
        ...schedules,
        [selectedDate]: {
          dots: schedules[selectedDate]?.dots,
          selected: true,
        },
      }}
      onDayPress={(date) => {
        setSelectedDate(date.dateString);
        setRefresh(true);
      }} */
    />
  );
}

export default BookingsCalendar;
