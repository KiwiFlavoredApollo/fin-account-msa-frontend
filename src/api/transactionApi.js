import apiClient from "./apiClient";

export const deposit = (data) => {
  return apiClient.post("/transactions/deposit", data);
};

export const withdraw = (data) => {
  return apiClient.post("/transactions/withdraw", data);
};

export const transfer = (data) => {
  return apiClient.post("/transactions/transfer", data);
};

export const getTransaction = (transactionId) => {
  return apiClient.get(`/transactions/${transactionId}`);
};

export const getTransactions = (accountId) => {
  return apiClient.get("/transactions", {
    params: {
      accountId,
    },
  });
};
