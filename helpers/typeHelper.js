export const capitalize = (string) => {
  return string.slice(0, 1).toUpperCase() + string.slice(1);
};

export const checkInputLimit = (value, limit) => {
  return parseFloat(value) > parseFloat(limit) ? limit : value;
};
