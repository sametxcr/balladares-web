export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

if (process.env.TBK_ENV === 'INTEGRATION') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import https from 'https';

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rut, pack_id, pack_qty, qty } = await req.json();
    
    const packs = pack_qty || qty || 1;
    const order_code = `BM${Date.now()}`.slice(0, 26);
    const amount = pack_id === 'x1' ? 3000 * packs : 10000 * packs;
    const totalStickers = pack_id === 'x1' ? packs : packs * 4;

    await pool.query(
      `INSERT INTO orders (order_code, email, nombre, rut, pack_id, qty, total, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'PENDING')`,
      [order_code, email, nombre, rut, pack_id, totalStickers, amount]
    );

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_URL || 'https://www.balladares-motors.cl';
    const commerceCode = process.env.TBK_API_KEY_ID!;
    const secret = process.env.TBK_API_KEY_SECRET!;

    console.log('CRED CHECK', { id: commerceCode, secretLen: secret?.length, hasEnv: !!process.env.TBK_API_KEY_SECRET });

    if(!commerceCode || !secret) throw new Error('Faltan credenciales TBK en Vercel');

    const agent = new https.Agent({ rejectUnauthorized: false });

    const tbkRes = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
      method: 'POST',
      // @ts-ignore
      agent,
      headers: {
        'Tbk-Api-Key-Id': commerceCode.trim(),
        'Tbk-Api-Key-Secret': secret.trim(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy_order: order_code,
        session_id: `S${Date.now()}`,
        amount,
        return_url: `${baseUrl}/api/webpay/commit`
      })
    } as any);

    const data = await tbkRes.json();
    console.log('TBK RESP', tbkRes.status, data);
    
    if (!tbkRes.ok) {
      return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });
    }

    return NextResponse.json({ url: data.url, token: data.token, order_code });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}