import apiClient from "./apiClient";

export const createAccount = (data) => {
  return apiClient.post("/accounts", data);
};

export const getAccount = (accountId) => {
  return apiClient.get(`/accounts/${accountId}`);
};
