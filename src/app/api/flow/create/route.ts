export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

function sign(params: any, secret: string) {
  const toSign = Object.keys(params).sort().map(k => `${k}${String(params[k]).trim()}`).join('')
  return crypto.createHmac('sha256', secret.trim().replace(/\n|\r/g,'')).update(toSign).digest('hex')
}

export async function POST(req: NextRequest) {
  const { email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, pack_qty } = await req.json();
  
  const packs = Number(pack_qty) || 1;
  const order_code = `BM${Date.now()}`.slice(0, 26);
  const total = pack_id === 'x1' ? 3000 * packs : 10000 * packs;
  const qty = pack_id === 'x1' ? packs : packs * 4;

  const apiKey = process.env.FLOW_API_KEY!.trim()
  const secret = process.env.FLOW_SECRET_KEY!.trim().replace(/\n|\r/g,'')

  const params: any = {
    apiKey,
    commerceOrder: order_code,
    subject: `Balladares ${order_code} - ${qty} stickers`,
    amount: String(total),
    email: email.trim(),
    urlConfirmation: `${process.env.NEXT_PUBLIC_URL!.trim()}/api/flow/webhook`,
    urlReturn: `${process.env.NEXT_PUBLIC_URL!.trim()}/api/flow/return?order=${order_code}`,
  };
  params.s = sign(params, secret);

  const FLOW_API_URL = process.env.FLOW_ENV === 'sandbox' ? 'https://sandbox.flow.cl/api' : 'https://www.flow.cl/api'
  const flowRes = await fetch(`${FLOW_API_URL}/payment/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
  });
  const data = await flowRes.json();
  console.log('FLOW CREATE', flowRes.status, data);

  if (!flowRes.ok || !data.token) {
    return NextResponse.json({ error: 'Flow Error', detail: data }, { status: 500 });
  }

  // AHORA SI GUARDAMOS TODO CON EL TOKEN DE FLOW
  await pool.query(
    `INSERT INTO orders(order_code,email,nombre,rut,celular,direccion,comuna,ciudad,region,pack_id,qty,total,status,flow_token) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,'PENDING',$13)`,
    [order_code, email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, qty, total, data.token]
  );

  return NextResponse.json({ url: `${data.url}?token=${data.token}`, token: data.token, order_code });
}