import axios from "axios";
import { config, params } from "../helpers/axiosHelper";
import { REACT_APP_BASE_URL, REACT_APP_BEARER_TOKEN } from "@env";
import { useAuth } from "../hooks";

const API_URL = `${REACT_APP_BASE_URL}/inquiries`;

export const getInquiries = async () => {
  const response = await axios.get(
    `${API_URL}/all?${params()}`,
    config(REACT_APP_BEARER_TOKEN)
  );

  return response;
};

export const createInquiry = async (data) => {
  const response = await axios.post(
    `${API_URL}`,
    data,
    config(REACT_APP_BEARER_TOKEN)
  );

  return response;
};

export const payInquiry = async ({ id, data }) => {
  const response = await axios.post(
    `${API_URL}/${id}/pay`,
    data,
    config(REACT_APP_BEARER_TOKEN)
  );

  return response;
};
