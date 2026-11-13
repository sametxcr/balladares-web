export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    
    // SOPORTA NUEVO (qty) Y VIEJO (pack_qty/pack_id) por si queda algo cacheado
    const rawQty = body.qty ?? body.pack_qty ?? 1;
    const qty = parseInt(rawQty, 10);
    if (!qty || qty < 1) return NextResponse.json({ error: 'qty inválido' }, { status: 400 });

    const { email, nombre, rut, celular, direccion, comuna, ciudad, region } = body;

    const PRECIO_U = 3000;
    const PRECIO_D = 2500;
    const total = qty >= 4 ? qty * PRECIO_D : qty * PRECIO_U;
    
    // qty = tickets a generar (1 sticker = 1 ticket)
    const ticketsQty = qty;
    const order_code = `BM${Date.now()}${Math.floor(100 + Math.random()*900)}`;
    
    const client = new MercadoPagoConfig({
      accessToken: process.env.MP_ACCESS_TOKEN!,
    });
    const preference = new Preference(client);

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.balladares-motors.cl';

    const result = await preference.create({
      body: {
        items: [
          {
            id: `x${qty}`,
            title: `${qty} STICKERS DIGITALES - PREMIOS BALLADARES`,
            quantity: 1,
            unit_price: total,
            currency_id: "CLP",
          }
        ],
        payer: { email: email },
        external_reference: order_code,
        auto_return: "approved", 
        back_urls: {
          success: `${baseUrl}/ventasticker/gracias?orden=${order_code}`,
          failure: `${baseUrl}/ventasticker`,
          pending: `${baseUrl}/ventasticker`,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        statement_descriptor: "BALLADARES",
        metadata: {
          order_code,
          qty: ticketsQty,
          pack_id: `x${qty}`,
          total,
          rut,
          celular
        }
      }
    });

    console.log('[MP CREATE] qty:', qty, 'tickets:', ticketsQty, 'total:', total, 'order:', order_code, 'pref:', result.id);

    await pool.query(
      `INSERT INTO orders(order_code, email, nombre, rut, pack_id, total, status, qty, celular, direccion, comuna, ciudad, region)
       VALUES($1,$2,$3,$4,$5,$6,'PENDING',$7,$8,$9,$10,$11,$12)`,
      [order_code, email, nombre, rut, `x${qty}`, total, ticketsQty, celular, direccion, comuna, ciudad, region]
    );

    return NextResponse.json({ 
      url: result.init_point,
      id: result.id,
      order_code 
    });

  } catch(e:any){
    console.error('MP CREATE ERROR', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}