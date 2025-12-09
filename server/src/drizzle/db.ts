import { drizzle } from 'drizzle-orm/neon-http';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');

import * as schema from './schema';

console.log(process.env)
export const db = drizzle(process.env.DATABASE_URL??'',{schema});
