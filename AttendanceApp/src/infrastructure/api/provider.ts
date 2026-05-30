// src/infrastructure/config/api-client.config.ts
import { createApiClient, tokenStore } from "app-framework";
import { AxiosInstance } from "axios";

export interface IApiClientProvider {
  getAuthClient(): AxiosInstance;
  // getAttendanceClient(): AxiosInstance;
}

// src/infrastructure/api/ApiClientProvider.ts
export class ApiClientProvider implements IApiClientProvider {
  private authApiClient: AxiosInstance;

  constructor(authApiUrl: string) {
    this.authApiClient = createApiClient(authApiUrl);
  }

  getAuthClient(): AxiosInstance {
    return this.authApiClient;
  }
}

// optional: re-export if needed elsewhere
export { tokenStore };
