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
    />
  );
}

export default BookingsCalendar;
