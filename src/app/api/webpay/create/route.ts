export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import { Pool } from 'pg';
import { TBK } from '@/lib/tbk';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rut, pack_id, pack_qty } = await req.json();
    const packs = pack_qty || 1;
    const order_code = `BM${Date.now()}`.slice(0,26);
    const amount = pack_id === 'x1' ? 3000*packs : 10000*packs;
    const totalStickers = pack_id === 'x1' ? packs : packs*4;

    await pool.query(
      `INSERT INTO orders (order_code, email, nombre, rut, pack_id, qty, total, status) VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING')`,
      [order_code, email, nombre, rut, pack_id, totalStickers, amount]
    );

    const agent = new https.Agent({ rejectUnauthorized: false });

    const tbkRes = await fetch(TBK.URL, {
      method: 'POST',
      // @ts-ignore
      agent,
      headers: {
        'Tbk-Api-Key-Id': TBK.ID,
        'Tbk-Api-Key-Secret': TBK.SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy_order: order_code,
        session_id: `S${Date.now()}`,
        amount,
        return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webpay/commit`
      })
    } as any);

    const data = await tbkRes.json();
    console.log('TBK RESP', tbkRes.status, data, 'USING', TBK.ID);

    if (!tbkRes.ok) return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });

    return NextResponse.json({ url: data.url, token: data.token, order_code });
  } catch(e:any){
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}