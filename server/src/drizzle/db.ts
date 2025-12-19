import { drizzle } from 'drizzle-orm/neon-serverless';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');

import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL??'',{schema});
