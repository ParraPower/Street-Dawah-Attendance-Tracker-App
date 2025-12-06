declare global {
    namespace NodeJS {
      interface ProcessEnv {
        NODE_ENV: string;
        DATABASE_URL: string;
        BYPASS_AUTHN: string;
        BYPASS_AUTHZ: string;
      }
    }
  }

  export {}