import AppDataSource from '@/data/data-source';
import { JwtKey } from '@/domains/keys/key-entity';

let privateKeyCache: { kid: string; key: string } | null = null;
let publicKeyCache: Record<string, string> = {};

export async function loadKeysIntoCache() {
  const repo = AppDataSource.getRepository(JwtKey);
  const keys = await repo.find();

  publicKeyCache = {};
  privateKeyCache = null;

  for (const k of keys) {
    publicKeyCache[k.kid] = k.publicKey;
    if (k.isActive && k.privateKey) {
      privateKeyCache = { kid: k.kid, key: k.privateKey };
    }
  }

  if (!privateKeyCache) {
    throw new Error('No active private key found');
  }
}

export function getPrivateKey() {
  if (!privateKeyCache) throw new Error('Private key not loaded');
  return privateKeyCache;
}

export function getPublicKey(kid: string) {
  return publicKeyCache[kid];
}

export function getAllPublicKeys() {
  return publicKeyCache;
}
