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

const getEmailHtml = (orderCode: string, tickets: string[]) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0a0a0a;padding:20px;">
    <!-- HEADER -->
    <div style="background:linear-gradient(135deg,#E30613 0%,#b50510 100%);border-radius:16px 16px 0 0;padding:25px;text-align:center;">
      <img src="https://www.balladares-motors.cl/logo.png" alt="Balladares Motors" style="height:55px;max-width:220px;filter:brightness(0) invert(1);"/>
      <h1 style="color:#fff;margin:15px 0 0;font-size:22px;letter-spacing:2px;">BALLADARES MOTORS</h1>
    </div>
    <!-- BODY -->
    <div style="background:#111;border:1px solid #222;border-top:none;border-radius:0 0 16px 16px;padding:30px;">
      <div style="text-align:center;margin-bottom:25px;">
        <div style="display:inline-block;background:#FFD700;color:#000;padding:6px 18px;border-radius:20px;font-weight:900;font-size:12px;letter-spacing:1px;">PAGO APROBADO</div>
        <h2 style="color:#fff;font-size:20px;margin:15px 0 5px;">¡Gracias por tu compra!</h2>
        <p style="color:#aaa;font-size:14px;margin:0;">Orden <span style="color:#fff;font-weight:700">${orderCode}</span> • ${tickets.length} ticket${tickets.length>1?'s':''}</p>
      </div>

      <!-- TICKETS -->
      <div style="display:grid;gap:12px;margin:25px 0;">
        ${tickets.map(t => `
          <div style="background:linear-gradient(90deg,#1a1a1a,#222);border:1.5px dashed #FFD700;border-radius:12px;padding:14px 18px;display:flex;justify-content:space-between;align-items:center;">
            <span style="color:#888;font-size:11px;letter-spacing:1px;">TICKET</span>
            <span style="color:#FFD700;font-size:18px;font-weight:900;letter-spacing:2px;">${t}</span>
            <span style="background:#E30613;color:#fff;font-size:10px;padding:4px 8px;border-radius:6px;">VÁLIDO</span>
          </div>
        `).join('')}
      </div>

      <div style="background:#E30613;border-radius:10px;padding:16px;text-align:center;margin:25px 0;">
        <p style="color:#fff;margin:0;font-size:13px;">Sorteo: <strong>Honda Civic Type R + $10.000.000</strong></p>
      </div>

      <a href="https://www.balladares-motors.cl/sorteos/exito?orden=${orderCode}&tickets=${tickets.join(',')}" style="display:block;background:#fff;color:#000;text-align:center;padding:14px;border-radius:10px;text-decoration:none;font-weight:900;font-size:15px;">VER MIS TICKETS EN LA WEB</a>

      <p style="color:#666;font-size:11px;text-align:center;margin-top:25px;line-height:1.5;">Guarda este correo. Te contactaremos al mismo email si resultas ganador.<br/>¿Dudas? Escríbenos a hola@balladares-motors.cl</p>
    </div>
    <p style="color:#444;font-size:10px;text-align:center;margin-top:15px;">Balladares Motors • Concepción, Chile</p>
  </div>
</body>
</html>
`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const tbkRes = await fetch(`${TBK.URL}/${token}`, { method: 'PUT', headers: { 'Tbk-Api-Key-Id': TBK.ID, 'Tbk-Api-Key-Secret': TBK.SECRET, 'Content-Type': 'application/json' } });
    const tbk = await tbkRes.json();
    if (tbk.status !== 'AUTHORIZED' && tbk.response_code !== 0) return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status || tbk.response_code}`, req.url));
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
        catch (e: any) { if (e.code !== '23505') throw e; }
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
        html: getEmailHtml(order.order_code, tickets),
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
  const token = req.nextUrl.searchParams.get('token_ws'); if (!token) return NextResponse.redirect(new URL('/?error=no_token', req.url)); return processPayment(token, req);
}
export async function POST(req: NextRequest) {
  const form = await req.formData(); const token = form.get('token_ws') as string; if (!token) return NextResponse.redirect(new URL('/?error=no_token_post', req.url)); return processPayment(token, req);
}export const runtime = 'nodejs'
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
<html>
<body style="margin:0;padding:0;background:#080808;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:620px;margin:0 auto;background:#0f0f0f;">
    <!-- HEADER RACING -->
    <div style="background:#000;padding:20px 20px 0 20px;text-align:center;border-bottom:4px solid #E30613;">
      <img src="https://www.balladares-motors.cl/logo-principal.png" alt="Balladares Motors" style="height:50px;max-width:260px;object-fit:contain;"/>
    </div>
    <div style="background:linear-gradient(180deg,#1a1a1a 0%,#0f0f0f 100%);padding:25px;text-align:center;">
      <img src="https://www.balladares-motors.cl/escudo.png" alt="Escudo" style="height:75px;margin-bottom:12px;"/>
      <div style="display:inline-block;background:#FFD700;color:#000;padding:5px 14px;border-radius:4px;font-weight:900;font-size:11px;letter-spacing:1.5px;">PAGO APROBADO ✓</div>
      <h1 style="color:#fff;font-size:24px;margin:15px 0 5px;font-weight:900;letter-spacing:1px;">¡GRACIAS POR TU COMPRA!</h1>
      <p style="color:#aaa;font-size:14px;margin:0;">Orden <strong style="color:#fff;">${orderCode}</strong> • ${qty} ticket${qty>1?'s':''} • Honda Civic Type R</p>
    </div>

    <!-- TICKETS RACING -->
    <div style="padding:20px;background:#0f0f0f;">
      ${tickets.map((t, i) => `
        <div style="background:#fff;border-left:6px solid #E30613;border-radius:8px;padding:16px 18px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="color:#E30613;font-size:10px;font-weight:900;letter-spacing:1px;">BALLADARES MOTORS #${i+1}</div>
            <div style="color:#000;font-size:19px;font-weight:900;letter-spacing:2px;margin-top:2px;">${t}</div>
          </div>
          <div style="text-align:right;">
            <div style="background:#000;color:#FFD700;font-size:10px;font-weight:900;padding:5px 10px;border-radius:4px;">VÁLIDO</div>
            <div style="color:#888;font-size:10px;margin-top:4px;">SORTEO OFICIAL</div>
          </div>
        </div>
      `).join('')}

      <div style="background:linear-gradient(90deg,#E30613,#ff1a2a);border-radius:8px;padding:14px;text-align:center;margin-top:18px;">
        <span style="color:#fff;font-weight:900;font-size:13px;">🏁 GUARDA ESTE CORREO - ES TU COMPROBANTE OFICIAL 🏁</span>
      </div>

      <a href="https://www.balladares-motors.cl/sorteos/exito?orden=${orderCode}&tickets=${tickets.join(',')}" style="display:block;background:#FFD700;color:#000;text-align:center;padding:16px;border-radius:8px;text-decoration:none;font-weight:900;font-size:15px;margin-top:16px;letter-spacing:0.5px;">VER MIS TICKETS EN LA WEB →</a>

      <div style="display:flex;gap:10px;margin-top:20px;justify-content:center;">
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:10px 15px;text-align:center;flex:1;">
          <div style="color:#FFD700;font-size:18px;">📅</div><div style="color:#fff;font-size:11px;margin-top:4px;">Sorteo en Vivo</div>
        </div>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:10px 15px;text-align:center;flex:1;">
          <div style="color:#FFD700;font-size:18px;">🎥</div><div style="color:#fff;font-size:11px;margin-top:4px;">Instagram Live</div>
        </div>
        <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:10px 15px;text-align:center;flex:1;">
          <div style="color:#FFD700;font-size:18px;">📧</div><div style="color:#fff;font-size:11px;margin-top:4px;">Aviso por Email</div>
        </div>
      </div>

      <p style="color:#666;font-size:11px;text-align:center;margin-top:22px;line-height:1.6;">Si resultas ganador te contactamos a este mismo correo.<br/>Dudas: <a href="mailto:hola@balladares-motors.cl" style="color:#E30613;text-decoration:none;">hola@balladares-motors.cl</a> • Concepción</p>
    </div>
    <div style="background:#000;padding:12px;text-align:center;border-top:1px solid #222;">
      <p style="color:#444;font-size:10px;margin:0;">© 2026 Balladares Motors - Todos los derechos reservados</p>
    </div>
  </div>
</body>
</html>
`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const tbkRes = await fetch(`${TBK.URL}/${token}`, { method: 'PUT', headers: { 'Tbk-Api-Key-Id': TBK.ID, 'Tbk-Api-Key-Secret': TBK.SECRET, 'Content-Type': 'application/json' } });
    const tbk = await tbkRes.json();
    if (tbk.status !== 'AUTHORIZED' && tbk.response_code !== 0) return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status || tbk.response_code}`, req.url));
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
        catch (e: any) { if (e.code !== '23505') throw e; }
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
  const token = req.nextUrl.searchParams.get('token_ws'); if (!token) return NextResponse.redirect(new URL('/?error=no_token', req.url)); return processPayment(token, req);
}
export async function POST(req: NextRequest) {
  const form = await req.formData(); const token = form.get('token_ws') as string; if (!token) return NextResponse.redirect(new URL('/?error=no_token_post', req.url)); return processPayment(token, req);
}