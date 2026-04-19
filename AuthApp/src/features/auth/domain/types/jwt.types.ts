export type TokenType = 'access' | 'refresh';

export interface JwtPayload {
  sub: string;           // user ID
  jti: string;
  scope: string;         // space-separated: "user-read user-write"
  aud: string | string[];
  iss: string;
  type: TokenType;
}
