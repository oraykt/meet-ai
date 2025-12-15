import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || `postgresql://${process.env.PGDB_USER}:${process.env.PGDB_PASSWORD}@${process.env.PGDB_HOST}/${process.env.PGDB_NAME}`,
  },
});
