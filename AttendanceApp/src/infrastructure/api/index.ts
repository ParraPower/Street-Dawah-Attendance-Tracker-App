import { ApiClientProvider, IApiClientProvider } from "./provider";

export const apiClientProvider = new ApiClientProvider(
  process.env.AUTH_API_URL!
);

export { IApiClientProvider };
