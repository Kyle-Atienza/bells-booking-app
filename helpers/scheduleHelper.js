const colors = ["#b8e3fd", "#b6fbb6", "#f195e9", "#f8a8b2"];

const dotKeys = {
  inquiry: { key: "inquiry", color: "#b8e3fd" },
  withDownpaymentDue: { key: "withDownpaymentDue", color: "#ee71ff" },
  withDownpayment: { key: "withDownpayment", color: " #b6fbb6" },
  confirmed: { key: "confirmed", color: "#deff8a" },
};

const mapStatusToDots = (status) => {
  switch (status) {
    case "Inquiry":
      return dotKeys.inquiry;
    case "With Downpayment Due":
      return dotKeys.withDownpaymentDue;
    case "Confirmed":
      return dotKeys.withDownpayment;
    case "Fully Paid":
      return dotKeys.confirmed;
    default:
      break;
  }
};

export const getDatesInRange = (datesArray) => {
  let datesObj = {};
  let colorIndex = 0;

  for (let i = 0; i < datesArray.length; i++, colorIndex++) {
    if (colorIndex >= datesArray.length - 2) {
      colorIndex = 0;
    }

    let currentDate = new Date(datesArray[i].startDate);
    let endDate = datesArray[i].endDate
      ? new Date(datesArray[i].endDate)
      : null;

    if (!endDate) {
      let dateString = currentDate.toISOString().slice(0, 10);
      if (!datesObj[dateString]) {
        datesObj[dateString] = {
          periods: [],
          dots: [],
        };
      }
      datesObj[dateString].dots = [
        ...datesObj[dateString].dots,
        mapStatusToDots(datesArray[i].status),
      ];
      datesObj[dateString].periods.push({
        color: colors[colorIndex],
        id: datesArray[i].id,
        startingDay: datesArray[i].startDate == dateString,
        endingDay: true,
      });
      continue;
    }

    while (currentDate <= endDate) {
      let dateString = currentDate.toISOString().slice(0, 10);
      if (!datesObj[dateString]) {
        datesObj[dateString] = {
          periods: [],
          dots: [],
        };
      }
      datesObj[dateString].dots = [
        ...datesObj[dateString].dots,
        mapStatusToDots(datesArray[i].status),
      ];
      datesObj[dateString].periods.push({
        color: colors[colorIndex],
        id: datesArray[i].id,
        startingDay: datesArray[i].startDate == dateString,
        endingDay: datesArray[i].endDate == dateString,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return datesObj;
};
