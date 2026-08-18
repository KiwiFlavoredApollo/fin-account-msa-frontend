import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // F12 콘솔 로깅 (Request)
    console.groupCollapsed(
      `%c🚀 [API Request] ${config.method?.toUpperCase()} ${config.url}`,
      "color: #0284c7; font-weight: bold;"
    );
    console.log("Headers:", config.headers);
    if (config.params) console.log("Params:", config.params);
    if (config.data) console.log("Body:", config.data);
    console.groupEnd();

    return config;
  },
  (error) => {
    console.error("❌ [API Request Error]", error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // F12 콘솔 로깅 (Response)
    console.groupCollapsed(
      `%c✅ [API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`,
      "color: #16a34a; font-weight: bold;"
    );
    console.log("Data:", response.data);
    console.log("Headers:", response.headers);
    console.groupEnd();

    return response;
  },
  (error) => {
    const status = error.response ? error.response.status : "NETWORK_ERROR";
    console.group(
      `%c❌ [API Error] ${status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      "color: #dc2626; font-weight: bold;"
    );
    if (error.response) {
      console.log("Response Data:", error.response.data);
      console.log("Status:", error.response.status);
    } else {
      console.log("Message:", error.message);
    }
    console.groupEnd();

    return Promise.reject(error);
  }
);

export default apiClient;

