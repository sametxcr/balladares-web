export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

const TBK_ID = '597055555532';
const TBK_SECRET = '579B532A7440BB0C9079DED94D31EA1615BACEB36B38C77FB7D7179E317BD139F';
const TBK_URL = 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions';

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rut, pack_id, pack_qty } = await req.json();
    const packs = Number(pack_qty) || 1;
    const order_code = `BM${Date.now()}`.slice(0,26);
    const amount = pack_id === 'x1' ? 3000*packs : 10000*packs;
    const totalStickers = pack_id === 'x1' ? packs : packs*4;

    await pool.query(
      `INSERT INTO orders (order_code, email, nombre, rut, pack_id, qty, total, status) VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING')`,
      [order_code, email, nombre, rut, pack_id, totalStickers, amount]
    );

    console.log('FORZANDO TBK', TBK_ID, TBK_SECRET.length, TBK_SECRET.slice(-4));

    const tbkRes = await fetch(TBK_URL, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TBK_ID,
        'Tbk-Api-Key-Secret': TBK_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy_order: order_code,
        session_id: `S${Date.now()}`,
        amount,
        return_url: `https://www.balladares-motors.cl/api/webpay/commit`
      })
    });

    const data = await tbkRes.json();
    console.log('RESP TBK', tbkRes.status, data);

    if (!tbkRes.ok) return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });

    return NextResponse.json({ url: data.url, token: data.token, order_code });
  } catch(e:any){
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}