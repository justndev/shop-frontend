import axios from 'axios';
import Cookies from 'js-cookie';
import config from "@/src/config";

const BACKEND_API_URL = config.BACKEND_API_URL;

const apiClient = axios.create({
  baseURL: BACKEND_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: string) => void; reject: (e: unknown) => void }> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
}

// Intercept 401 and refresh token
apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;
      const refreshToken = Cookies.get('refreshToken');

      if (!refreshToken) {
        Cookies.remove('accessToken');
        // if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BACKEND_API_URL}/auth/refresh`, { refreshToken });
        Cookies.set('accessToken', data.data.accessToken, { expires: 1 / 24 });
        Cookies.set('refreshToken', data.data.refreshToken, { expires: 7 });
        apiClient.defaults.headers.common.Authorization = `Bearer ${data.data.accessToken}`;
        processQueue(null, data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        // if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
)

export default apiClient;
