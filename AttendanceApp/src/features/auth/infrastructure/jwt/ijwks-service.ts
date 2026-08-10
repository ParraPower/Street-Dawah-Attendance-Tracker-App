/**
 * Interface for JWKS (JSON Web Key Set) service
 * Abstracts external library dependencies and provides a contract for public key retrieval
 */
export interface IJwksService {
  /**
   * Retrieve all public keys from the JWKS endpoint
   * @returns Promise<Record<string, string>> - Map of key ID (kid) to public key
   */
  getAllPublicKeys(): Promise<Record<string, string>>;

  /**
   * Retrieve a single public key by key ID (kid)
   * @param kid - The key identifier
   * @returns Promise<string | null> - The public key or null if not found
   */
  getPublicKey(kid: string): Promise<string | null>;
}
