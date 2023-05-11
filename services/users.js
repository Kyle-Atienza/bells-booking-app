import axios from "axios";
import { REACT_APP_BASE_URL } from "@env";
import { appAxios } from "./base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_BASE_URL}/users`;

export const createUser = async (data) => {
  console.log(data);
  return await appAxios.post(`${API_URL}`, data);
};
