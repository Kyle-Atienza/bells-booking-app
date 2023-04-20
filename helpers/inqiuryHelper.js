import { DateTime } from "luxon";
import { parseRangeTime } from "./timeHelper";

export const validateForm = (inquiryType, { formData, amountData }) => {
  if (
    inquiryType === "event" &&
    (!formData.name || !formData.date || !formData.schedule || !formData.estPax)
  ) {
    return false;
  } else if (
    inquiryType === "apartment" &&
    (!formData.name ||
      !formData.range.startDate ||
      !formData.range.endDate ||
      !formData.apartmentCount ||
      !formData.estPax)
  ) {
    return false;
  }
  return true;
};

export const mapDataToDb = (
  inquiryType,
  { formData, amountData, priceData }
) => {
  return {
    type: inquiryType,
    name: formData.name,
    estimated_pax: formData.estPax,
    event_date:
      inquiryType === "event"
        ? DateTime.fromISO(formData.date.toISOString())
            .toFormat("yyyy LL dd")
            .replaceAll(" ", "-")
        : null,
    event_time_from:
      inquiryType === "event" ? parseRangeTime(formData.schedule)[0] : null,
    event_time_to:
      inquiryType === "event" ? parseRangeTime(formData.schedule)[1] : null,
    apt_date_from:
      inquiryType === "apartment"
        ? DateTime.fromISO(formData.range.startDate.toISOString())
            .toFormat("yyyy LL dd")
            .replaceAll(" ", "-")
        : null,
    apt_date_to:
      inquiryType === "apartment"
        ? DateTime.fromISO(formData.range.endDate.toISOString())
            .toFormat("yyyy LL dd")
            .replaceAll(" ", "-")
        : null,
    apt_qty:
      inquiryType === "apartment" ? parseInt(formData.apartmentCount) : null,
    apt_addon:
      inquiryType === "event" ? parseInt(formData.apartmentCount) : null,
    discount: formData.discount || 0,
    downpayment: formData.downpayment || 0,
    downpayment_due: new Date(formData.downpaymentDue).toISOString(),
    balance: amountData.balance,
    apartment_price: priceData.APARTMENT_PRICE,
    event_base_price: priceData.EVENT_BASE_PRICE,
    apartment_addon_price: priceData.APARTMENT_ADDON_PRICE,
  };
};

export const mapDataFromDb = (data, inquiryId) => {
  const currentData = data.find((item) => item.id === parseInt(inquiryId));

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
      estPax: currentData.estimated_pax.toString(),
      discount: parseFloat(currentData.discount)
        ? parseFloat(currentData.discount).toString()
        : null,
      downpaymentDue:
        currentData.downpayment_due !== "1970-01-01T05:00:00.000Z"
          ? new Date(currentData.downpayment_due)
          : null,
      downpayment: parseFloat(currentData.downpayment)
        ? parseFloat(currentData.downpayment).toString()
        : null,
      apartmentCount: currentData.apt_addon || currentData.apt_qty,
    },
    balance: currentData.balance,
    prices: {
      APARTMENT_PRICE: parseFloat(currentData.apartment_price),
      EVENT_BASE_PRICE: parseFloat(currentData.event_base_price),
      APARTMENT_ADDON_PRICE: parseFloat(currentData.apartment_addon_price),
    },
  };
};

export const compute = (
  newInquiry,
  inquiryType,
  prices,
  formData,
  amountData
) => {
  let subTotal = 0;
  let totalAmountDue = 0;
  let balance = 0;

  if (inquiryType === "apartment") {
    if (
      !!formData.range.startDate &&
      !!formData.range.endDate &&
      formData.apartmentCount
    ) {
      const startDate = new Date(formData.range.startDate.toISOString());
      const endDate = new Date(formData.range.endDate.toISOString());
      const days = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));

      subTotal = formData.apartmentCount * prices.APARTMENT_PRICE * days;
    }
  } else if (inquiryType === "event") {
    subTotal += parseFloat(prices.EVENT_BASE_PRICE);
    subTotal += parseFloat(
      (formData.apartmentCount || 0) * prices.APARTMENT_ADDON_PRICE
    );
  }

  totalAmountDue = subTotal - formData.discount || 0;
  balance = newInquiry
    ? totalAmountDue - formData.downpayment || 0
    : amountData.balance;

  return {
    subTotal,
    totalAmountDue,
    balance,
  };
};

export const inquiryStatus = (data) => {
  if (
    data.downpayment_due === "1970-01-01T05:00:00.000Z" &&
    parseFloat(data.balance) !== 0
  ) {
    if (parseFloat(data.downpayment)) {
      return "With Downpayment";
    }
    return "Inquiry";
  } else {
    if (parseFloat(data.balance) === 0) {
      return "Confirmed";
    } else {
      return "With Downpayment Due";
    }
  }
};
