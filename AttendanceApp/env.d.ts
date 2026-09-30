declare global {
    namespace NodeJS {
      interface ProcessEnv {
        AUTH_API_URL: string;
        AUTH_API_JWT_AUDIENCE: string;
        AUTH_API_JWT_ISSUER: string;

        BASE_URL: string;

        PORT: string;
        NODE_ENV: string;
        
        BYPASS_AUTHN: string;
        BYPASS_AUTHZ: string;

        FINAL_MOBILE_FORMAT: string;

        DB_URL: string
        DB_HOST: string
        DB_PORT: string
        DB_USER: string
        DB_PASSWORD: string
        DB_NAME: string
      }
    }
  }

  export {}