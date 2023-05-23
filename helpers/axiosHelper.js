const params = (page, limit, sort) => {
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

export { params };
