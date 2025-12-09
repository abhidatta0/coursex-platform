import { drizzle } from 'drizzle-orm/neon-http';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');

import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL??'',{schema});
