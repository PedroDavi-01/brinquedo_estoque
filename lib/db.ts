// lib/db.ts
import { drizzle } from 'drizzle-orm/neon-http'; // ou a lib que você usa
import { neon } from '@neondatabase/serverless';

// Pega a URL do ambiente, não deixa ela escrita aqui!
const sql = neon(process.env.DATABASE_URL!); 
export const db = drizzle(sql);