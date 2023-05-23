import axios from "axios";
import { params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL } from "@env";
import { appAxios } from "./base";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = `${REACT_APP_BASE_URL}/users`;

export const createUser = async (data) => {
  return await appAxios.post(`${API_URL}`, data);
};

export const getUsers = async () => {
  return await appAxios.get(`${API_URL}/all`);
};

export const updateUser = async ({ id, data }) => {
  return await appAxios.put(`${API_URL}/${id}`, data);
};

export const deleteUser = async (id) => {
  return await appAxios.delete(`${API_URL}/${id}`);
};
