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

const getHtml = (orderCode: string, tickets: string[]) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#050505;font-family:Arial;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#000;padding:22px;text-align:center;border-bottom:4px solid #E30613;">
    <img src="https://www.balladares-motors.cl/BB.png" style="height:48px;" />
  </div>
  <div style="background:#121212;padding:28px;text-align:center;">
    <img src="https://www.balladares-motors.cl/escudo.png" style="height:72px;margin-bottom:12px;" />
    <div style="background:#FFD700;color:#000;display:inline-block;padding:6px 16px;border-radius:20px;font-weight:900;font-size:11px;">PAGO APROBADO</div>
    <h1 style="color:#fff;margin:14px 0 6px;font-weight:900;">¡GRACIAS POR TU COMPRA!</h1>
    <p style="color:#aaa;font-size:13px;">Orden <b style="color:#fff;">${orderCode}</b> • ${tickets.length} ticket(s)</p>
  </div>
  <div style="background:#0e0e0e;padding:20px;">
    ${tickets.map((t,i) => `
      <div style="background:#fff;border-left:6px solid #E30613;border-radius:8px;padding:14px 16px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
        <div><div style="color:#E30613;font-size:10px;font-weight:900;">TICKET #${i+1}</div><div style="color:#000;font-size:18px;font-weight:900;letter-spacing:2px;">${t}</div></div>
        <div style="background:#000;color:#FFD700;font-size:10px;font-weight:900;padding:6px 10px;border-radius:4px;">VALIDO</div>
      </div>`).join('')}
  </div>
</div></body></html>`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const tbkRes = await fetch(`${TBK.URL}/${token}`, { method: 'PUT', headers: { 'Tbk-Api-Key-Id': TBK.ID, 'Tbk-Api-Key-Secret': TBK.SECRET, 'Content-Type': 'application/json' } });
    const tbk = await tbkRes.json();
    console.log('TBK PRO', tbk);

    if (tbk.status!== 'AUTHORIZED' && tbk.response_code!== 0) {
      return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status}`, req.url));
    }

    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [tbk.buy_order]);
    const order = rows[0];
    if (!order) { await client.query('ROLLBACK'); return NextResponse.redirect(new URL('/?error=orden_no_encontrada', req.url)); }

    if (order.status === 'PAID') {
      const tks = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id]);
      await client.query('COMMIT');
      return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tks.rows.map((r:any)=>r.ticket_code).join(',')}`, req.url));
    }

    const tickets: string[] = [];
    for (let i=0; i<order.qty; i++) {
      let ok=false; while(!ok){ const code=genCode(); try{ await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email]); ok=true; tickets.push(code);} catch(e:any){ if(e.code!=='23505') throw e; } }
    }

    await client.query(`UPDATE orders SET status='PAID' WHERE id=$1`, [order.id]);
    await client.query(`INSERT INTO email_jobs (order_code, email, tickets, status) VALUES ($1,$2,$3,'pending')`, [order.order_code, order.email, tickets]);
    await client.query('COMMIT');

    // EN PRO SÍ ALCANZAMOS A HACER AWAIT TRANQUILO
    console.log('ENVIANDO MAIL PRO...', order.email);
    const { data, error } = await resend.emails.send({
      from: 'Balladares Motors <hola@balladares-motors.cl>',
      to: order.email,
      subject: `Tus tickets ${order.order_code} - Balladares Motors`,
      html: getHtml(order.order_code, tickets)
    });

    if (error) {
      console.error('RESEND ERROR PRO', error);
    } else {
      console.log('MAIL PRO ENVIADO', data);
      await pool.query(`UPDATE email_jobs SET status='SENT' WHERE order_code=$1`, [order.order_code]);
    }

    return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tickets.join(',')}`, req.url));

  } catch (e:any) { await client.query('ROLLBACK'); console.error('COMMIT PRO CRASH', e); return NextResponse.redirect(new URL(`/?error=commit&msg=${encodeURIComponent(e.message)}`, req.url)); }
  finally { client.release(); }
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