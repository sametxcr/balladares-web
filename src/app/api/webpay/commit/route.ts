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

const getEmailHtml = (orderCode: string, tickets: string[], qty: number) => `
<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#080808;font-family:Arial;">
<div style="max-width:620px;margin:0 auto;background:#0f0f0f;">
<div style="background:#000;padding:20px;text-align:center;border-bottom:4px solid #E30613;">
<img src="https://www.balladares-motors.cl/logo-principal.png" alt="Balladares" style="height:50px;max-width:260px;"/>
</div>
<div style="background:linear-gradient(180deg,#1a1a1a,#0f0f0f);padding:25px;text-align:center;">
<img src="https://www.balladares-motors.cl/escudo.png" alt="Escudo" style="height:75px;margin-bottom:12px;"/>
<div style="display:inline-block;background:#FFD700;color:#000;padding:5px 14px;border-radius:4px;font-weight:900;font-size:11px;">PAGO APROBADO ✓</div>
<h1 style="color:#fff;font-size:24px;margin:15px 0 5px;">¡GRACIAS POR TU COMPRA!</h1>
<p style="color:#aaa;font-size:14px;margin:0;">Orden <strong style="color:#fff;">${orderCode}</strong> • ${qty} tickets</p>
</div>
<div style="padding:20px;background:#0f0f0f;">
${tickets.map((t,i)=>`<div style="background:#fff;border-left:6px solid #E30613;border-radius:8px;padding:16px 18px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;"><div><div style="color:#E30613;font-size:10px;font-weight:900;">BALLADARES MOTORS #${i+1}</div><div style="color:#000;font-size:19px;font-weight:900;letter-spacing:2px;">${t}</div></div><div style="background:#000;color:#FFD700;font-size:10px;font-weight:900;padding:5px 10px;border-radius:4px;">VÁLIDO</div></div>`).join('')}
<a href="https://www.balladares-motors.cl/sorteos/exito?orden=${orderCode}&tickets=${tickets.join(',')}" style="display:block;background:#FFD700;color:#000;text-align:center;padding:16px;border-radius:8px;text-decoration:none;font-weight:900;margin-top:16px;">VER MIS TICKETS →</a>
</div></div></body></html>
`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const tbkRes = await fetch(`${TBK.URL}/${token}`, { method: 'PUT', headers: { 'Tbk-Api-Key-Id': TBK.ID, 'Tbk-Api-Key-Secret': TBK.SECRET, 'Content-Type': 'application/json' } });
    const tbk = await tbkRes.json();
    if (tbk.status!== 'AUTHORIZED' && tbk.response_code!== 0) return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status || tbk.response_code}`, req.url));
    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [tbk.buy_order]);
    if (!rows[0]) { await client.query('ROLLBACK'); return NextResponse.redirect(new URL('/?error=orden_no_encontrada', req.url)); }
    const order = rows[0];
    if (order.status === 'PAID') {
      const tks = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id]);
      await client.query('COMMIT');
      return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tks.rows.map((r:any)=>r.ticket_code).join(',')}`, req.url));
    }
    const tickets: string[] = [];
    for (let i = 0; i < order.qty; i++) {
      let ok = false; while (!ok) {
        const code = genCode();
        try { await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email]); ok = true; tickets.push(code); }
        catch (e: any) { if (e.code!== '23505') throw e; }
      }
    }
    await client.query(`UPDATE orders SET status='PAID' WHERE id=$1`, [order.id]);
    await client.query(`INSERT INTO email_jobs (order_code, email, tickets, status) VALUES ($1,$2,$3,'pending')`, [order.order_code, order.email, tickets]);
    await client.query('COMMIT');
    try {
      await resend.emails.send({
        from: 'Balladares Motors <hola@send.balladares-motors.cl>',
        to: order.email,
        subject: `Tus tickets - Orden ${order.order_code} - Balladares Motors`,
        html: getEmailHtml(order.order_code, tickets, order.qty),
      });
      await pool.query(`UPDATE email_jobs SET status='SENT', attempts=1 WHERE order_code=$1`, [order.order_code]);
    } catch (e) { console.error('MAIL FAIL', e); }
    return NextResponse.redirect(new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tickets.join(',')}`, req.url));
  } catch (e: any) {
    await client.query('ROLLBACK');
    return NextResponse.redirect(new URL(`/?error=commit&msg=${encodeURIComponent(e.message)}`, req.url));
  } finally { client.release(); }
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