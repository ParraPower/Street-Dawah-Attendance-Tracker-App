import { ITokenProvider } from "../auth/interfaces/token-provider";
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";

// ---- Create an API client ----
export function createApiClient(baseURL: string, tokenProvider: ITokenProvider): AxiosInstance {
  // Use a *separate* client for refresh to avoid interceptor recursion
  const api = axios.create({ baseURL });
  
  api.interceptors.request.use(async (config) => {
    console.log("API Request intercepted");

    if (!tokenProvider) return config;

    console.log("Checking for cached access token");

    const token = await tokenProvider.getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return api;

  // Attach Authorization header on every request
  // api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  //   const token = tokenStore.getAccessToken();
  //   if (token) {
  //     config.headers = config.headers ?? {};
  //     config.headers.Authorization = `Bearer ${token}`;
  //   }
  //   return config;
  // });

  // // Single-flight refresh (prevents many simultaneous refresh calls)
  // let refreshPromise: Promise<string | null> | null = null;

  // async function refreshAccessToken(): Promise<string | null> {
  //   const rt = tokenStore.getRefreshToken();
  //   if (!rt) return null;

  //   // If already refreshing, reuse the same promise
  //   if (refreshPromise) return refreshPromise;

  //   refreshPromise = (async () => {
  //     // TODO: adapt endpoint/payload to your auth server
  //     const res = await authClient.post("/auth/access-token", { refreshToken: rt });

  //     const newAccessToken = res.data?.accessToken as string | undefined;
  //     const newRefreshToken = rt as string | undefined;

  //     if (!newAccessToken) return null;

  //     tokenStore.setAccessToken(newAccessToken);
  //     if (newRefreshToken) tokenStore.setRefreshToken(newRefreshToken);

  //     return newAccessToken;
  //   })()
  //     .catch(() => null)
  //     .finally(() => {
  //       refreshPromise = null;
  //     });

  //   return refreshPromise;
  // }

  // api.interceptors.response.use(
  //   (response) => response,
  //   async (error: AxiosError) => {
  //     const status = error.response?.status;
  //     const originalRequest = error.config as (InternalAxiosRequestConfig & { _retry?: boolean; _skipAuthRefresh?: boolean }) | undefined;

  //     if (!originalRequest || status !== 401) {
  //       throw error;
  //     }

  //     // Don't attempt refresh for the refresh endpoint (or any request you mark)
  //     if (originalRequest._skipAuthRefresh || originalRequest.url?.includes("/auth/refresh")) {
  //       throw error;
  //     }

  //     // If we already retried once, fail completely (your requirement)
  //     if (originalRequest._retry) {
  //       throw error;
  //     }

  //     originalRequest._retry = true;

  //     // Attempt refresh, then replay request once
  //     const newToken = await refreshAccessToken();
  //     if (!newToken) {
  //       throw error;
  //     }

  //     originalRequest.headers = originalRequest.headers ?? {};
  //     originalRequest.headers.Authorization = `Bearer ${newToken}`;

  //     return api.request(originalRequest);
  //   }
  // );

  // return api;
}
