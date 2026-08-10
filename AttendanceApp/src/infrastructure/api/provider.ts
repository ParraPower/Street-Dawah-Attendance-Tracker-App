// <project-root>/AttendanceApp/src/infrastructure/config/api-client.config.ts
import { createApiClient, ClientCredentialsTokenProvider } from "app-framework";
import axios, { AxiosInstance } from "axios";

export interface IApiClientProvider {
  getAuthClient(): AxiosInstance;
  // getAttendanceClient(): AxiosInstance;
}

export class ApiClientProvider implements IApiClientProvider {
  private authApiClient: AxiosInstance;

  constructor(authApiUrl: string) {
    const api = axios.create({ baseURL: authApiUrl }); 

    console.log("Starting up api client...")

    const tokenProvider = new ClientCredentialsTokenProvider(
      api,
      // These should ideally come from environment variables or secure config
      process.env.AUTH_API_CLIENT_ID!,
      process.env.AUTH_API_CLIENT_SECRET!,
      'auth-api'
    );

    this.authApiClient = createApiClient(authApiUrl, tokenProvider);

    console.log("Created auth api client...")
    
  }

  getAuthClient(): AxiosInstance {
    return this.authApiClient;
  }
}