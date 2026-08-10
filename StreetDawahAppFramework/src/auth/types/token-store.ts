// ---- Token helpers (swap for your storage) ----
export type TokenEntry = {
  accessToken: string | null;
  refreshToken: string | null;
};

const store = new Map<string, TokenEntry>();

export const tokenStore = {
  getAccessToken: (key: string) =>
    store.get(key)?.accessToken ?? null,

  setAccessToken: (key: string, token: string | null) => {
    const entry = store.get(key) ?? { accessToken: null, refreshToken: null };
    entry.accessToken = token;
    store.set(key, entry);
  },

  getRefreshToken: (key: string) =>
    store.get(key)?.refreshToken ?? null,

  setRefreshToken: (key: string, token: string | null) => {
    const entry = store.get(key) ?? { accessToken: null, refreshToken: null };
    entry.refreshToken = token;
    store.set(key, entry);
  },
};