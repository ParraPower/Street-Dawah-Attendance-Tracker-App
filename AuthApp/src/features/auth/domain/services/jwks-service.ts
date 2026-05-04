import { ICryptographyService } from 'app-framework';

type KeyObjectExportOptions = {
  format: string
}

type ExportedJwkPublicKey = {
  kty: string,
  n: string,
  e: string
}

type PublicKeyObject = {
  export: (options: KeyObjectExportOptions) => ExportedJwkPublicKey
}

export class JwksService {
  constructor(private readonly cryptographyService: ICryptographyService) {

  }
  // Jwks related business logic can be added here in the future

  private isValidPublicKey(pem: string): { isValid: boolean; pubKey?: PublicKeyObject } {
    try {
      const pubKey = this.cryptographyService.createPublicKey(pem) as PublicKeyObject;
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


  private useValidatePemPublicKey(pem: string): {  isValid: boolean, pubKey?: PublicKeyObject } {
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
    const jwk = (pubKey as PublicKeyObject ).export({ format: 'jwk' });

    return {
      kty: jwk.kty,   // "RSA"
      n: jwk.n,       // base64url modulus
      e: jwk.e,       // base64url exponent (usually "AQAB")
    };
  }
}