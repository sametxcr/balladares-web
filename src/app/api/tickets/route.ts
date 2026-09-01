export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function GET(req: NextRequest) {
  const order = req.nextUrl.searchParams.get('order')
  if (!order) return NextResponse.json({ tickets: [] })
  const { rows } = await pool.query(
    `SELECT ticket_code FROM tickets WHERE order_id = (SELECT id FROM orders WHERE order_code=$1)`,
    [order]
  )
  return NextResponse.json({ tickets: rows.map(r => r.ticket_code) })
}