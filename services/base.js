import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const appAxios = axios.create();

appAxios.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("@accessToken");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
      config.headers["Content-Type"] = "application/json";
      config.headers.Accept = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { appAxios };
