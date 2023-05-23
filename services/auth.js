import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_BASE_URL}/auth`;

export const login = async (credentials) => {
  return await axios.post(`${API_URL}/signin`, credentials);
};

export const logout = async () => {
  return await axios.post(`${API_URL}/logout`);
};
