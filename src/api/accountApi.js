import apiClient from "./apiClient";

export const createAccount = (data) => {
  return apiClient.post("/api/accounts", data);
};

export const getAccount = (accountId) => {
  return apiClient.get(`/api/accounts/${accountId}`);
};
