import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';

// Check if DATABASE_URL environment variable is present
if (!process.env.DATABASE_URL) {
  // Check if any of the other environment variables are missing or undefined
  const requiredParams = [process.env.PGDB_USER, process.env.PGDB_PASSWORD, process.env.PGDB_HOST, process.env.PGDB_NAME];
  for (const param of requiredParams) {
    if (!param) {
      throw new Error(`Missing environment variable: ${param}`);
    }
  }
}

export const db = drizzle(process.env.DATABASE_URL || `postgresql://${process.env.PGDB_USER}:${process.env.PGDB_PASSWORD}@${process.env.PGDB_HOST}/${process.env.PGDB_NAME}`);

