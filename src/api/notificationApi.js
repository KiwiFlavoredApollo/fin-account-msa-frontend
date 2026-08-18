import apiClient from "./apiClient";

export const getNotifications = (ownerName) => {
  if (ownerName) {
    return apiClient.get(`/notifications/${encodeURIComponent(ownerName)}`);
  }
  return apiClient.get("/notifications");
};

export const getNotification = (notificationId) => {
  return apiClient.get(`/notifications/${notificationId}`);
};

export const markAsRead = (notificationId) => {
  return apiClient.patch(`/notifications/${notificationId}/read`);
};
