
export interface ITokenCache {
  getAccessToken(audience: string): string | null;
  setAccessToken(audience: string, token: string | null): void;
};

export interface ITokenCacheService {
  getTokenCache(): ITokenCache;
}