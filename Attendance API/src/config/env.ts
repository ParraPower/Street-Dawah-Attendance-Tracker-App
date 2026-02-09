export const env = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  authApiUrl: process.env.AUTH_API_URL || 'http://localhost:4000',
  authApiJwtAudience: process.env.AUTH_API_JWT_AUDIENCE || 'auth-api',   // PEM string
  authApiJwtIssuer: process.env.AUTH_API_JWT_ISSUER || 'auth-api',
  db: {
    url: process.env.DATABASE_URL!,
  },
  logFormat: process.env.LOG_FORMAT || 'dev',
};
