const colors = ["#b8e3fd", "#b6fbb6", "#f195e9", "#f8a8b2"];

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
        };
      }
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
        };
      }
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
