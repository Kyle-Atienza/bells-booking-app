import { REACT_APP_BASE_URL, REACT_APP_BEARER_TOKEN } from "@env";

export const config = (token) => {
  return {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: {},
  };
};

export const params = (page, limit, sort) => {
  const defaults = {
    page: 1,
    limit: 20,
    sort: "-created_at",
  };

  let paramsString = [];

  if (page !== -1) paramsString.push(`page=${page || defaults.page}`);
  if (limit !== -1) paramsString.push(`limit=${limit || defaults.limit}`);
  paramsString.push(`sort=${sort || defaults.sort}`);

  return paramsString.join("&");
};
