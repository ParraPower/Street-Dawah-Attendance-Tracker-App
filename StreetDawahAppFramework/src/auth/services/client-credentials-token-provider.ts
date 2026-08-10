import { AxiosInstance } from "axios";
import { ITokenProvider } from "../interfaces/token-provider";
import { NotSupportedError } from "../../errors/types";
import { tokenStore } from "../types/token-store";

export class ClientCredentialsTokenProvider implements ITokenProvider {
  private expiry = 0;
  private inflight: Promise<string | null> | null = null;

  constructor(
    private authClient: AxiosInstance,
    private clientId: string,
    private clientSecret: string,
    private key: string
  ) {}
  async setAccessToken(t: string | null) {
    tokenStore.setAccessToken(this.key, t);
  }
  async getRefreshToken(): Promise<string | null> {
    throw new NotSupportedError("Client credentials flow does not use refresh tokens");
  }
  async setRefreshToken(t: string | null) {
    throw new NotSupportedError("Client credentials flow does not use refresh tokens");
  }

  async getAccessToken(): Promise<string | null> {
    const now = Date.now();

    const cached = tokenStore.getAccessToken(this.key);

    if (cached && now < this.expiry) {
      return cached;
    }

    if (this.inflight) return this.inflight;

    this.inflight = (async () => {
      const res = await this.authClient.post("/auth/token", {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      });

      const token = res.data?.accessToken;
      const expiresIn = res.data?.expiresIn ?? 300;

      if (!token) return null;

      tokenStore.setAccessToken(this.key, token);
      this.expiry = Date.now() + (expiresIn - 10) * 1000;

      return token;
    })()
      .catch(() => null)
      .finally(() => {
        this.inflight = null;
      });

    return this.inflight;
  }
}