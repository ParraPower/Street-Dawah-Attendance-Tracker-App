export interface ITokenProvider {
  getAccessToken: () => Promise<string | null>;
  setAccessToken: (t: string | null) => void;
  getRefreshToken: () => Promise<string | null>;
  setRefreshToken: (t: string | null) => void;
}

