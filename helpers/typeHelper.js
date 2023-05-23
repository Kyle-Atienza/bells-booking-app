export const capitalize = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export const checkInputLimit = (value, limit) => {
  return parseFloat(value) > parseFloat(limit) ? limit : value;
};

export const checkInputFloor = (value, floor) => {
  return parseFloat(value) < parseFloat(floor) ? floor : value;
};
