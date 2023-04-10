export const formatTime = (timeString) => {
  const [hourString, minute] = timeString.split(":");
  const hour = +hourString % 24;
  return (hour % 12 || 12) + ":" + minute + (hour < 12 ? "AM" : "PM");
};

export const parseRangeTime = (range) => {
  return ([from, to] = range.split(" to "));
};
