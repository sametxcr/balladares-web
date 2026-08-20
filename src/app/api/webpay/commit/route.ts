export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const TBK = {
  ID: '597055555532',
  SECRET: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C',
  URL: 'https://webpay3gint.transbank.cl/rswebpaytransaction/api/webpay/v1.2/transactions'
};

const resend = new Resend(process.env.RESEND_API_KEY);
const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const tbkRes = await fetch(`${TBK.URL}/${token}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': TBK.ID,
        'Tbk-Api-Key-Secret': TBK.SECRET,
        'Content-Type': 'application/json'
      }
    });
    
    const tbk = await tbkRes.json();
    console.log('TBK COMMIT', tbkRes.status, tbk);

    if (tbk.status !== 'AUTHORIZED' && tbk.response_code !== 0) {
      return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status || tbk.response_code}`, req.url));
    }

    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [tbk.buy_order]);
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return NextResponse.redirect(new URL('/?error=orden_no_encontrada', req.url));
    }
    const order = rows[0];

    if (order.status === 'PAID') {
      const tks = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id]);
      await client.query('COMMIT');
      return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tks.rows.map((r:any)=>r.ticket_code).join(',')}`, req.url));
    }

    const tickets: string[] = [];
    for (let i = 0; i < order.qty; i++) {
      let ok = false;
      while (!ok) {
        const code = genCode();
        try {
          await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email]);
          ok = true;
          tickets.push(code);
        } catch (e: any) {
          if (e.code !== '23505') throw e;
        }
      }
    }

    await client.query(`UPDATE orders SET status='PAID' WHERE id=$1`, [order.id]);
    
    let emailSent = false;
    try {
      await resend.emails.send({
        from: 'Balladares Motors <hola@balladares-motors.cl>',
        to: order.email,
        subject: `¡PAGO CONFIRMADO! Tus ${tickets.length} tickets - ${order.order_code}`,
        html: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#000000;">
    <div style="background:#000;padding:25px 30px;text-align:center;border-bottom:3px solid #FFD700;">
      <img src="https://www.balladares-motors.cl/logo.png" alt="Balladares Motors" style="height:48px;" />
      <div style="color:#FFD700;font-weight:900;font-style:italic;font-size:20px;letter-spacing:1px;margin-top:8px;">BALLADARES MOTORS</div>
    </div>
    <div style="padding:35px 30px;background:#111;color:#fff;">
      <h1 style="margin:0 0 10px 0;font-size:28px;font-weight:900;font-style:italic;color:#FFD700;">¡PAGO CONFIRMADO!</h1>
      <p style="color:#ccc;font-size:15px;margin:0 0 25px 0;">Gracias por participar, estás dentro del sorteo.</p>
      <div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:20px;margin-bottom:25px;">
        <div style="display:flex;justify-content:space-between;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px;"><span>ORDEN</span><span>CANT</span></div>
        <div style="display:flex;justify-content:space-between;color:#fff;font-weight:700;font-size:16px;margin-top:5px;"><span>${order.order_code}</span><span>${order.qty} tickets</span></div>
      </div>
      <p style="color:#FFD700;font-weight:700;font-size:13px;letter-spacing:1px;margin-bottom:15px;">TUS TICKETS:</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:30px;">
        ${tickets.map(t => `<div style="background:#000;border:1px dashed #FFD700;border-radius:10px;padding:14px;text-align:center;"><div style="color:#fff;font-weight:900;font-size:16px;letter-spacing:2px;">${t}</div></div>`).join('')}
      </div>
      <a href="https://www.balladares-motors.cl/sorteos/exito?orden=${order.order_code}&tickets=${tickets.join(',')}" style="display:block;background:#FFD700;color:#000;text-align:center;padding:16px;border-radius:8px;font-weight:900;text-decoration:none;font-style:italic;font-size:16px;">VER MIS TICKETS</a>
      <p style="color:#666;font-size:11px;text-align:center;margin-top:25px;line-height:1.5;">Guarda este correo. Sorteo en vivo por Instagram @balladares.motors<br>¡Mucha suerte!</p>
    </div>
    <div style="background:#000;padding:20px;text-align:center;border-top:1px solid #222;">
      <p style="color:#555;font-size:11px;margin:0;">Balladares Motors • www.balladares-motors.cl</p>
    </div>
  </div>
</body>
</html>`
      });
      emailSent = true;
    } catch (e) { console.error('RESEND FAIL', e); }

    if (!emailSent) {
      await client.query(`INSERT INTO email_jobs (order_id, email, order_code, tickets) VALUES ($1,$2,$3,$4)`, [order.id, order.email, order.order_code, tickets]);
    }

    await client.query('COMMIT');
    return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tickets.join(',')}`, req.url));

  } catch (e: any) {
    await client.query('ROLLBACK');
    console.error('COMMIT CRASH', e);
    return NextResponse.redirect(new URL(`/?error=commit&msg=${encodeURIComponent(e.message)}`, req.url));
  } finally {
    client.release();
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token_ws');
  if (!token) return NextResponse.redirect(new URL('/?error=no_token', req.url));
  return processPayment(token, req);
}
export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = form.get('token_ws') as string;
  if (!token) return NextResponse.redirect(new URL('/?error=no_token_post', req.url));
  return processPayment(token, req);
}