import apiClient from "./apiClient";

export const getNotifications = (ownerName) => {
  if (ownerName) {
    return apiClient.get(`/api/notifications/${encodeURIComponent(ownerName)}`);
  }
  return apiClient.get("/api/notifications");
};

export const getNotification = (notificationId) => {
  return apiClient.get(`/api/notifications/${notificationId}`);
};

export const markAsRead = (notificationId) => {
  return apiClient.patch(`/api/notifications/${notificationId}/read`);
};
