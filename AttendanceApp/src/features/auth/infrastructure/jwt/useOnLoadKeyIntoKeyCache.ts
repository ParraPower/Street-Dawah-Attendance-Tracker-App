import { KeyCacheService } from 'app-framework';
import { IJwksService } from './ijwks-service';

/**
 * Hook to load public keys from Auth App's JWKS endpoint into the key cache on startup
 * Similar to AuthApp's useOnLoadKeyIntoKeyCache but uses JWKS instead of database repository
 */
export class UseOnLoadKeyIntoKeyCache {
  constructor(
    private readonly jwksService: IJwksService,
    private readonly keyCacheService: KeyCacheService,
  ) {}

  /**
   * Execute hook: Fetch all public keys from JWKS endpoint and populate the key cache
   * @throws Error if no keys are found or if key retrieval fails
   */
  public execute = async (): Promise<void> => {
    // Fetch all public keys from JWKS endpoint
    const keys = await this.jwksService.getAllPublicKeys();

    // Reset cache to start fresh
    this.keyCacheService.resetCache();

    // Populate cache with all public keys
    for (const [kid, publicKey] of Object.entries(keys)) {
      this.keyCacheService.setPublicKeyCache(kid, publicKey);
    }

    // Validate that at least one key was loaded
    if (Object.keys(keys).length === 0) {
      throw new Error('No public keys found in JWKS endpoint');
    }
  };
}
