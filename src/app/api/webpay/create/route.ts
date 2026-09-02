export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from 'transbank-sdk';

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const { email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, pack_qty } = body;
    
    // FIX REAL
    const packs = Number(pack_qty) || 1; // cuantos packs compró
    const isX4 = pack_id === 'x4';
    
    const total = isX4 ? 10000 * packs : 3000 * packs; // lo que paga
    const qty = isX4 ? 4 * packs : 1 * packs; // lo que se guarda como tickets
    
    // ej: x4, qty 1 -> total 10000, qty 4 tickets
    // ej: x4, qty 2 -> total 20000, qty 8 tickets
    
    const order_code = `BM${Date.now()}${Math.floor(100 + Math.random()*900)}`;
    const returnUrl = `${process.env.NEXT_PUBLIC_URL}/api/webpay/commit`;

    const isLive = process.env.TBK_ENV === 'LIVE';
    const options = isLive
    ? new Options(process.env.TBK_API_KEY_ID!.trim(), process.env.TBK_API_KEY_SECRET!.trim(), Environment.Production)
      : new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration);

    const tx = new WebpayPlus.Transaction(options);
    const create = await tx.create(order_code, order_code, total, returnUrl);

    console.log('[CREATE] pack:', pack_id, 'packs:', packs, 'tickets:', qty, 'total:', total, 'order:', order_code);

    await pool.query(
      `INSERT INTO orders(order_code, email, nombre, rut, pack_id, total, status, qty, celular, direccion, comuna, ciudad, region)
       VALUES($1,$2,$3,$4,$5,$6,'PENDING',$7,$8,$9,$10,$11,$12)`,
      [order_code, email, nombre, rut, pack_id, total, qty, celular, direccion, comuna, ciudad, region]
    );

    return NextResponse.json({ url: create.url, token: create.token });
  } catch(e:any){
    console.error('CREATE ERROR', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}