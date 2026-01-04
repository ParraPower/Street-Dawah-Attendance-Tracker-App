import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), `.env.local`) });
console.log('Loading environment variables from .env file', process.env);

import { createDataSource } from '.././src/config/ormconfig';

const AppDataSource = createDataSource();

export default AppDataSource;