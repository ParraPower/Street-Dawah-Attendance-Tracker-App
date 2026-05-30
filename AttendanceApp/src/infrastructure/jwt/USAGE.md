/**
 * Example usage of UseOnLoadKeyIntoKeyCache hook
 * 
 * This should be called during application bootstrap to load public keys
 * from the Auth App's JWKS endpoint and populate the KeyCacheService
 */

import { KeyCacheService } from 'app-framework';
import { JwksService, UseOnLoadKeyIntoKeyCache } from '@attendance/infrastructure/jwt';

/**
 * Initialize and execute the key cache loading hook
 * Call this in your server.ts or bootstrap logic before starting the server
 */
export async function initializeKeyCache(): Promise<void> {
  // Get the JWKS endpoint URL from environment variables
  const jwksUri = process.env.AUTH_APP_JWKS_URI || `${process.env.AUTH_API_URL}/.well-known/jwks.json`;
  
  if (!jwksUri) {
    throw new Error('AUTH_APP_JWKS_URI or AUTH_API_URL environment variable is not set');
  }

  // Initialize services
  const jwksService = new JwksService(jwksUri);
  const keyCacheService = new KeyCacheService();

  // Create and execute the hook
  const hook = new UseOnLoadKeyIntoKeyCache(jwksService, keyCacheService);
  
  try {
    await hook.execute();
    console.log('✓ Public keys loaded into cache from JWKS endpoint');
  } catch (error) {
    console.error('✗ Failed to load public keys:', error);
    throw error; // Re-throw to prevent server startup without valid keys
  }
}

/**
 * Usage in server.ts:
 * 
 * import { initializeKeyCache } from './path/to/this/file';
 * 
 * async function bootstrap() {
 *   await initializeKeyCache();
 *   // ... rest of server initialization
 *   app.listen(PORT, () => {
 *     console.log(`Server running on port ${PORT}`);
 *   });
 * }
 * 
 * bootstrap().catch(error => {
 *   console.error('Failed to start server:', error);
 *   process.exit(1);
 * });
 */
