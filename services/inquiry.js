import { params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL } from "@env";
import { appAxios } from "./base";

const API_URL = `${REACT_APP_BASE_URL}/inquiries`;

export const getInquiries = async () => {
  return await appAxios.get(`${API_URL}/all?${params()}`);
};

export const createInquiry = async (data) => {
  return await appAxios.post(`${API_URL}`, data);
};

export const payInquiry = async ({ id, data }) => {
  return await appAxios.post(`${API_URL}/${id}/pay`, data);
};
