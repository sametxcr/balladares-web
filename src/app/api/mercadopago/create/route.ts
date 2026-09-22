export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function POST(req: NextRequest){
  try {
    const body = await req.json();
    const { email, nombre, rut, celular, direccion, comuna, ciudad, region, pack_id, pack_qty } = body;
    
    const packs = Number(pack_qty) || 1;
    const isX4 = pack_id === 'x4';
    
    const total = isX4 ? 10000 * packs : 3000 * packs;
    const qty = isX4 ? 4 * packs : 1 * packs;
    
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
            id: pack_id,
            title: isX4 ? `Pack x${qty} Tickets - Balladares` : `Ticket Balladares - ${pack_id}`,
            quantity: 1,
            unit_price: total,
            currency_id: "CLP",
          }
        ],
        payer: {
          email: email,
          name: nombre,
        },
        external_reference: order_code,
        auto_return: "approved", 
        back_urls: {
          // CAMBIO CLAVE WN: NO VA A /gracias, VA A TU WEBHOOK QUE VALIDA Y LUEGO REDIRIGE A GRACIAS
          success: `${baseUrl}/api/mercadopago/webhook?orden=${order_code}`,
          failure: `${baseUrl}/ventasticker/fallido`,
          pending: `${baseUrl}/ventasticker/fallido`,
        },
        notification_url: `${baseUrl}/api/mercadopago/webhook`,
        metadata: {
          order_code,
          pack_id,
          qty,
          rut,
          celular
        }
      }
    });

    console.log('[MP CREATE] pack:', pack_id, 'packs:', packs, 'tickets:', qty, 'total:', total, 'order:', order_code, 'pref:', result.id);

    await pool.query(
      `INSERT INTO orders(order_code, email, nombre, rut, pack_id, total, status, qty, celular, direccion, comuna, ciudad, region)
       VALUES($1,$2,$3,$4,$5,$6,'PENDING',$7,$8,$9,$10,$11,$12)`,
      [order_code, email, nombre, rut, pack_id, total, qty, celular, direccion, comuna, ciudad, region]
    );

    return NextResponse.json({ 
      url: result.init_point,
      sandbox_url: result.sandbox_init_point,
      id: result.id,
      order_code 
    });

  } catch(e:any){
    console.error('MP CREATE ERROR', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}