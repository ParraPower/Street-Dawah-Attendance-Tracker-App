export const env = {
  env: process.env.NODE_ENV || 'local',
  port: Number(process.env.PORT) || 4000,
  jwtIssuer: process.env.JWT_ISSUER || 'auth-api',
  jwtDefaultAudience: process.env.JWT_DEFAULT_AUDIENCE || 'auth-api',
  accessTokenTtl: process.env.JWT_EXPIRATION_TIME || '15m',
  refreshTokenTtl: process.env.JWT_EXPIRATION_TIME || '7d',
  db: {
    url: process.env.DATABASE_URL!,
  },
};