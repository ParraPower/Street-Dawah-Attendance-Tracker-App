declare global {
    namespace NodeJS {
      interface ProcessEnv {
        AUTH_API_URL: string;
        AUTH_API_JWT_AUDIENCE: string;
        AUTH_API_JWT_ISSUER: string;

        PORT: string;
        NODE_ENV: string;
        DATABASE_URL: string;
        
        BYPASS_AUTHN: string;
        BYPASS_AUTHZ: string;
      }
    }
  }

  export {}