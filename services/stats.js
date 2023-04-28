import { params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL } from "@env";
import { appAxios } from "./base";

const API_URL = `${REACT_APP_BASE_URL}/stats`;

export const getStats = async () => {
  return await appAxios.get(`${API_URL}`);
};
