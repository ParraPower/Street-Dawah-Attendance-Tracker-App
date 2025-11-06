import * as dotenv from 'dotenv';

// Dynamically load based on NODE_ENV or default to .env.local
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'local'}` });
