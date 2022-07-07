import axios from "axios";

const instance = axios.create({
  baseURL: "",  // setUpProxy.js cors 에러 방지 => baseURL 필요없음
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      if (!config.headers) config.headers = {};
      config.headers["x-auth-token"] = accessToken; // for Node.js Express back-end
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (originalConfig.url !== "/api/user/get/tokens" && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const refreshTokenId = localStorage.getItem("refreshTokenId");
          const res = await instance.post("/api/user/get/accessToken", {
            refreshTokenId: refreshTokenId,
          });
          const { accessToken } = res.data;
          localStorage.setItem('accessToken', accessToken);
          return instance(originalConfig);
        } catch (_error) {
          return Promise.reject(_error);
        }
      }
    }
    return Promise.reject(err);
  }
);

export default instance;
