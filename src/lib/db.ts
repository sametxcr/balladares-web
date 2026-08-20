import { Pool } from 'pg';
declare global { var pgPool: Pool | undefined; }
function createPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no definida');
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 20, min: 5,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 15000
  });
}
export const pool = global.pgPool ?? createPool();
if (process.env.NODE_ENV !== 'production') global.pgPool = pool;
export async function queryWithRetry(text: string, params?: any[], retries = 3) {
  for (let i = 0; i < retries; i++) {
    try { return await pool.query(text, params); }
    catch (e: any) {
      if (e.code === '53300' || e.message?.includes('too many')) {
        await new Promise(r => setTimeout(r, 300 * (i + 1)));
        continue;
      }
      throw e;
    }
  }
}