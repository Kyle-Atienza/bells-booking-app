import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { UtilitiesContext } from "../contexts";
import { parseRangeTime } from "../helpers/timeHelper";
import { createInquiry, getInquiries, payInquiry } from "../services";

export const useInquiry = () => {
  const route = useRouter();

  const { setRefresh } = useContext(UtilitiesContext);

  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (inquiryType, { formData, amountData }) => {
    // console.log({ formData, amountData });
    if (
      inquiryType === "event" &&
      (!formData.name ||
        !formData.date ||
        !formData.schedule ||
        !formData.apartmentCount ||
        !formData.estPax ||
        !amountData.balance)
    ) {
      return false;
    } else if (
      inquiryType === "apartment" &&
      (!formData.name ||
        !formData.range.startDate ||
        !formData.range.endDate ||
        !formData.apartmentCount ||
        !formData.estPax ||
        !amountData.balance)
    ) {
      return false;
    }
    return true;
  };

  const mapDataToDb = (inquiryType, { formData, amountData }) => {
    return {
      type: inquiryType,
      name: formData.name,
      event_date:
        inquiryType === "event" ? new Date(formData.date).toISOString() : null,
      event_time_from:
        inquiryType === "event" ? parseRangeTime(formData.schedule)[0] : null,
      event_time_to:
        inquiryType === "event" ? parseRangeTime(formData.schedule)[1] : null,
      apt_date_from:
        inquiryType === "apartment"
          ? formData.range.startDate.toISOString().split("T")[0]
          : null,
      apt_date_to:
        inquiryType === "apartment"
          ? formData.range.endDate.toISOString().split("T")[0]
          : null,
      apt_qty:
        inquiryType === "apartment" ? parseInt(formData.apartmentCount) : null,
      apt_addon:
        inquiryType === "event" ? parseInt(formData.apartmentCount) : null,
      discount: formData.discount || 0,
      downpayment: formData.downpayment || 0,
      balance: amountData.balance,
    };
  };

  const mapDataFromDb = (data, inquiryId) => {
    const currentData = data.find((item) => item.id === parseInt(inquiryId));
    console.log(currentData);

    return {
      inquiryType: currentData.type,
      formData: {
        name: currentData.name,
        range: {
          startDate: new Date(currentData.apt_date_from),
          endDate: new Date(currentData.apt_date_to),
        },
        date: new Date(currentData.event_date),
        schedule: `${currentData.event_time_from} to ${currentData.event_time_to}`,
        estPax: null,
        discount: parseFloat(currentData.discount)
          ? parseFloat(currentData.discount).toString()
          : null,
        downpayment: parseFloat(currentData.downpayment)
          ? parseFloat(currentData.downpayment).toString()
          : null,
        apartmentCount: currentData.apt_addon || currentData.apt_qty,
      },
      balance: currentData.balance,
    };
  };

  return {
    validateForm,
    mapDataFromDb,
    mapDataToDb,
    isLoading,
  };
};
