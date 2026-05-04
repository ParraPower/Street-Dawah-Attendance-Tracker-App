let privateKeyCache: { kid: string; key: string } | null = null;
let publicKeyCache: Record<string, string> = {};


export class KeyCacheService {

  getPrivateKey = () => {
    if (!privateKeyCache) throw new Error('Private key not loaded');
    return privateKeyCache;
  }

  getPublicKey = (kid: string) => {
    return publicKeyCache[kid];
  }

  getAllPublicKeys = () => {
    return publicKeyCache;
  }

  resetCache = () => {
    publicKeyCache = {};
    privateKeyCache = null;
  }

  setPublicKeyCache = (kid: string, publicKey: string) => {
    publicKeyCache[kid] = publicKey
  }

  setPrivateKeyCache = (kid: string, privateKey: string) => {
    privateKeyCache = { kid,  key: privateKey }
  }

  isPrivateKeySet = () => !!privateKeyCache
}