import { Pool } from 'pg';
import dotenv from 'dotenv';
import { zeroNodePg } from '@rocicorp/zero/server/adapters/pg';
import { schema } from './schema';

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function transaction<T>(callback: (query: (text: string, params?: any[]) => Promise<any>) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    const transactionQuery = async (text: string, params?: any[]) => {
      return client.query(text, params);
    };
    
    const result = await callback(transactionQuery);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export const dbProvider = zeroNodePg(schema, pool);