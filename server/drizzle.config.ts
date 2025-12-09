import { defineConfig } from 'drizzle-kit';
import { loadEnvFile } from 'node:process';
loadEnvFile('.env');

export default defineConfig({
  out: './src/drizzle/migrations',
  schema: './src/drizzle/schema.ts',
  strict:true,
  verbose: true,
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
