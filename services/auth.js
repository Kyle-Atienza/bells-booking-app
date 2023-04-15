import axios from "axios";
import { config, params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL } from "@env";

const API_URL = `${REACT_APP_BASE_URL}/auth`;

export const login = async (credentials) => {
  const response = axios.post(`${API_URL}/signin`, credentials);

  return response;
};

export const logout = async () => {
  const response = axios.post(`${API_URL}/logout`);

  return response;
};
