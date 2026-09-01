export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

function sign(params: any, secret: string) {
  const cleanSecret = secret.trim().replace(/\n|\r/g,'').replace(/\s/g,'');
  const toSign = Object.keys(params).sort().map(k => `${k}${String(params[k]).trim()}`).join('')
  return crypto.createHmac('sha256', cleanSecret).update(toSign).digest('hex')
}

export async function POST(req: NextRequest) {
  try {
    const { email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, pack_qty } = await req.json();
    const packs = Number(pack_qty) || 1;
    const order_code = `BM${Date.now()}${Math.floor(Math.random()*1000)}`.slice(0, 14);
    const total = pack_id === 'x1'? 3000 * packs : 10000 * packs;
    const qty = pack_id === 'x1'? packs : packs * 4;

    const apiKey = process.env.FLOW_API_KEY!.trim()
    const secret = process.env.FLOW_SECRET_KEY!.trim()
    const baseUrl = process.env.NEXT_PUBLIC_URL!.trim().replace(/\/$/, '')

    const params: any = {
      apiKey,
      commerceOrder: order_code,
      subject: `Balladares ${order_code} - ${qty} tickets`,
      amount: String(total),
      email: email.trim(),
      urlConfirmation: `${baseUrl}/api/flow/webhook`,
      urlReturn: `${baseUrl}/api/flow/return?order=${order_code}`,
    };
    params.s = sign(params, secret);

    const FLOW_API_URL = process.env.FLOW_ENV === 'sandbox'? 'https://sandbox.flow.cl/api' : 'https://www.flow.cl/api'
    const flowRes = await fetch(`${FLOW_API_URL}/payment/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params),
      cache: 'no-store'
    });
    const text = await flowRes.text();
    let data: any; try { data = JSON.parse(text) } catch { data = { raw: text } }

    if (!flowRes.ok ||!data.token) return NextResponse.json({ error: 'Flow Error', detail: data }, { status: 500 });

    // TU TABLA ORDERS EXISTE, CON TODAS LAS COLUMNAS QUE MOSTRASTE
    await pool.query(
      `INSERT INTO orders(order_code,email,nombre,rut,celular,direccion,comuna,ciudad,region,pack_id,qty,total,status,flow_token,flow_order) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)`,
      [order_code, email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, qty, total, 'PENDING', data.token, data.flowOrder?.toString() || null]
    );

    return NextResponse.json({ url: `${data.url}?token=${data.token}`, token: data.token, order_code });
  } catch(e:any) {
    console.error('CREATE FATAL', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}