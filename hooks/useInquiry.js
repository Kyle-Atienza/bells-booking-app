import { useEffect, useState } from "react";
import { parseRangeTime } from "../helpers/timeHelper";
import { getInquiries } from "../services";
import { DateTime } from "luxon";
import { getDatesInRange } from "../helpers/scheduleHelper";
import { inquiryStatus } from "../helpers/inqiuryHelper";

export const useInquiry = () => {
  const [schedules, setSchedules] = useState({});

  const resetData = (setFormData, setAmountData, setPriceData) => {
    setFormData({
      name: null,
      range: { startDate: null, endDate: null },
      date: null,
      schedule: null,
      estPax: null,
      apartmentCount: null,
      discount: null,
      downpayment: null,
      downpaymentDue: null,
      payment: null,
    });
    setAmountData({
      subTotal: null,
      totalAmountDue: null,
      balance: null,
    });
    setPriceData({});
  };

  useEffect(() => {
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
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return {
    resetData,
    schedules,
  };
};
