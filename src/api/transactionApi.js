import apiClient from "./apiClient";

export const deposit = (data) => {
  return apiClient.post("/api/transactions/deposit", data);
};

export const withdraw = (data) => {
  return apiClient.post("/api/transactions/withdraw", data);
};

export const transfer = (data) => {
  return apiClient.post("/api/transactions/transfer", data);
};

export const getTransaction = (transactionId) => {
  return apiClient.get(`/api/transactions/${transactionId}`);
};

export const getTransactions = (accountId) => {
  return apiClient.get("/api/transactions", {
    params: {
      accountId,
    },
  });
};
