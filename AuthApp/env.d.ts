declare global {
    namespace NodeJS {
      interface ProcessEnv {
        BASE_URL: string;

        DB_HOST: string;
        DB_PORT: string;
        DB_URL: string;
        DB_NAME: string;
        DB_USER: string;
        DB_PASSWORD: string;

        PORT: string;
        NODE_ENV: string;

        JWT_ISSUER: string;
        JWT_DEFAULT_AUDIENCE: string;
        JWT_EXPIRATION_TIME: string;
      }
    }
  }

  export {}