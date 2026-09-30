export const env = {
  env: process.env.NODE_ENV || 'local',
  port: Number(process.env.PORT) || 4001,
  jwtIssuer: process.env.JWT_ISSUER || 'auth-api',
  jwtDefaultAudience: process.env.JWT_DEFAULT_AUDIENCE || 'auth-api',
  accessTokenTtl: process.env.JWT_EXPIRATION_TIME || '15m',
  refreshTokenTtl: process.env.JWT_EXPIRATION_TIME || '7d',
  db: {
    url: process.env.DB_URL!,
  },
  emailHost: process.env.EMAIL_HOST!,
  emailPort: Number(process.env.EMAIL_PORT),
  emailSecure: process.env.EMAIL_SECURE === 'true',
  emailUser: process.env.EMAIL_USER!,
  emailPassword: process.env.EMAIL_PASSWORD!,
  emailFrom: process.env.EMAIL_FROM!,
};