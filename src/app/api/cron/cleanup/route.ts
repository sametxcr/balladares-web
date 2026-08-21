export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Borra órdenes PENDING con más de 2 horas sin pagar
    const result = await pool.query(
      `DELETE FROM orders WHERE status='PENDING' AND created_at < NOW() - INTERVAL '2 hours' RETURNING order_code`
    );

    console.log(`[CLEANUP] ${result.rowCount} órdenes PENDING borradas:`, result.rows);

    return NextResponse.json({ 
      ok: true, 
      deleted: result.rowCount,
      codes: result.rows.map(r => r.order_code)
    });
  } catch (e: any) {
    console.error('[CLEANUP] ERROR', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}