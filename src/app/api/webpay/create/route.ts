export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { email, nombre, rut, pack_id, pack_qty } = await req.json();
  const packs = Number(pack_qty) || 1;
  const order_code = `BM${Date.now()}`.slice(0, 26);
  const total = pack_id === 'x1' ? 3000 * packs : 10000 * packs;
  const qty = pack_id === 'x1' ? packs : packs * 4;

  await pool.query(
    `INSERT INTO orders(order_code,email,nombre,rut,pack_id,qty,total,status) VALUES($1,$2,$3,$4,$5,$6,$7,'PENDING')`,
    [order_code, email, nombre, rut, pack_id, qty, total]
  );

  const tbkRes = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
    method: 'POST',
    headers: {
      'Tbk-Api-Key-Id': '597055555532',
      'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB36B38C77FB7D7179E317BD139F',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      buy_order: order_code,
      session_id: `S${Date.now()}`,
      amount: total,
      return_url: 'https://www.balladares-motors.cl/api/webpay/commit'
    })
  });

  const data = await tbkRes.json();
  if (!tbkRes.ok) return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });
  return NextResponse.json({ url: data.url, token: data.token, order_code });
}