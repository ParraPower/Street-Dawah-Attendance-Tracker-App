import jwksClient, { JwksClient } from 'jwks-rsa';
import { IJwksService } from '../../features/auth/infrastructure/jwt/ijwks-service';

/**
 * Implementation of IJwksService using jwks-rsa library
 * Retrieves and caches JWKS public keys from the Auth App's JWKS endpoint
 */
export class JwksService implements IJwksService {
  private readonly client: JwksClient;

  constructor(jwksUri: string) {
    console.log(`Initializing JwksService with JWKS URI: ${jwksUri}`);
    this.client = jwksClient({
      jwksUri,
      cache: true,
      cacheMaxEntries: 10,
      cacheMaxAge: 10 * 60 * 1000, // 10 minutes
      rateLimit: true,
      jwksRequestsPerMinute: 10,
    });
  }

  /**
   * Retrieve all public keys from JWKS endpoint
   * Note: This method fetches and processes all keys from the JWKS endpoint
   */
  async getAllPublicKeys(): Promise<Record<string, string>> {
    try {
      const keys = await this.client.getSigningKeys();
      const result: Record<string, string> = {};

      for (const key of keys) {
        if (key.kid && key.getPublicKey) {
          result[key.kid] = key.getPublicKey();
        }
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to retrieve JWKS public keys: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Retrieve a single public key by key ID (kid)
   */
  async getPublicKey(kid: string): Promise<string | null> {
    try {
      const key = await this.client.getSigningKey(kid);
      return key.getPublicKey() || null;
    } catch (error) {
      // Return null if key not found, rather than throwing
      if (error instanceof Error && error.message.includes('Unable to find a signing key')) {
        return null;
      }
      throw new Error(`Failed to retrieve public key for kid ${kid}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
