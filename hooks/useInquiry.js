import { parseRangeTime } from "../helpers/timeHelper";

export const useInquiry = () => {
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

  return {
    resetData,
  };
};
