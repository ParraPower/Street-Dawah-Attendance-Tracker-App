
export interface ICryptographyService {
    generateRandomBytes(keylength: number): NonSharedBuffer
    createPublicKey(pem: string): object
}