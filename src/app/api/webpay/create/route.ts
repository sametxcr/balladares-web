import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false } 
});

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

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

    // SECRET BUENO - EL MISMO QUE TE FUNCIONÓ EN EL CURL
    const tbkRes = await fetch('https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions', {
      method: 'POST',
      headers: {
        'Tbk-Api-Key-Id': '597055555532',
        'Tbk-Api-Key-Secret': '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        buy_order: order_code,
        session_id: `S${Date.now()}`,
        amount,
        return_url: `${baseUrl}/api/webpay/commit`
      })
    });

    const data = await tbkRes.json();
    console.log('TBK RESP', tbkRes.status, data);
    
    if (!tbkRes.ok) {
      console.error('TBK CREATE ERROR:', data);
      return NextResponse.json({ error: 'TBK Error', detail: data }, { status: 500 });
    }

    return NextResponse.json({ url: data.url, token: data.token, order_code });

  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}