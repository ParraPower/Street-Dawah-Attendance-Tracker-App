import crypto from 'crypto';

export class JwksService {
  // Jwks related business logic can be added here in the future

  private isValidPublicKey(pem: string): { isValid: boolean; pubKey?: crypto.KeyObject } {
    try {
      const pubKey = crypto.createPublicKey(pem);
      return { isValid: true, pubKey };
    } catch (err) {
      return { isValid: false };
    }
  }

  private looksLikePemPublicKey(pem: string): boolean {
    return (
      pem.includes('-----BEGIN PUBLIC KEY-----') &&
      pem.includes('-----END PUBLIC KEY-----')
    );
  }


  private useValidatePemPublicKey(pem: string): {  isValid: boolean, pubKey?: crypto.KeyObject } {
    if (!this.looksLikePemPublicKey(pem)) {
      return { isValid: false };
    }

    try {
      return this.isValidPublicKey(pem);
    } catch {
      return { isValid: false } ;
    }
  }

  public convertPEMToJWK(pem: string/*, kid: string*/) {
    // Convert PEM to a Node.js KeyObject
    const { isValid, pubKey } = this.useValidatePemPublicKey(pem);
    if (!isValid || !pubKey) {
      throw new Error('Invalid PEM public key');
    }
    // Export the key in JWK format
    const jwk = pubKey.export({ format: 'jwk' }) as any;

    return {
      kty: jwk.kty,   // "RSA"
      n: jwk.n,       // base64url modulus
      e: jwk.e,       // base64url exponent (usually "AQAB")
    };
  }
}