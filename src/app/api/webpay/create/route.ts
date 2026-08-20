export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { queryWithRetry } from '@/lib/db';
import { TBK } from '@/lib/tbk';

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rut, pack_id, pack_qty } = await req.json();
    const packs = Number(pack_qty) || 1;
    const order_code = `BM${Date.now()}`.slice(0,26);
    const amount = pack_id === 'x1' ? 3000*packs : 10000*packs;
    const totalStickers = pack_id === 'x1' ? packs : packs*4;

    await queryWithRetry(
      `INSERT INTO orders (order_code, email, nombre, rut, pack_id, qty, total, status) VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING')`,
      [order_code, email, nombre, rut, pack_id, totalStickers, amount]
    );

    console.log('ABRIENDO TBK', TBK.ID, TBK.SECRET.length);

    const tbkRes = await fetch(TBK.URL, {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': TBK.ID,
        'Tbk-Api-Key-Secret': TBK.SECRET,
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
    console.log('TBK RESP', tbkRes.status, data);

    if (!tbkRes.ok) return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });

    return NextResponse.json({ url: data.url, token: data.token, order_code });
  } catch(e:any){
    console.error('CREATE ERROR', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}