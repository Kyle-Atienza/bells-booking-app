import { params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL } from "@env";
import { appAxios } from "./base";

const API_URL = `${REACT_APP_BASE_URL}/configs`;

export const getConfigurations = async () => {
  return await appAxios.get(`${API_URL}`);
};

export const updateConfigurations = async (data) => {
  return await appAxios.post(`${API_URL}`, data);
};
