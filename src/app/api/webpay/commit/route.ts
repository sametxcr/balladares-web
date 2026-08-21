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

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">
  
  <!-- HEADER LOGO GRANDE -->
  <tr>
    <td style="background:#000000;padding:32px 24px 20px;text-align:center;border-bottom:4px solid #E30613;">
      <img src="https://www.balladares-motors.cl/BB.png" alt="Balladares Motors" style="height:72px;width:auto;display:block;margin:0 auto 14px;" />
      <div style="font-family:Arial, sans-serif;color:#ffffff;font-size:11px;letter-spacing:4px;font-weight:900;opacity:0.6;">BALLADARES MOTORS</div>
    </td>
  </tr>

  <!-- ESTADO -->
  <tr>
    <td style="padding:28px 32px 8px;text-align:center;background:#0f0f0f;">
      <img src="https://www.balladares-motors.cl/escudo.png" style="height:64px;width:auto;display:block;margin:0 auto 16px;" />
      <div style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;display:inline-block;padding:7px 18px;border-radius:100px;font-weight:900;font-size:11px;letter-spacing:1px;">✓ PAGO APROBADO</div>
      <h1 style="font-family:Arial Black, Arial, sans-serif;color:#fff;margin:18px 0 8px;font-weight:900;font-size:26px;line-height:1.1;letter-spacing:-0.5px;">¡Gracias por Participar!</h1>
      <p style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:14px;margin:0;line-height:1.5;">Tu pago se confirmó. Aquí tienes el detalle de tu orden.</p>
    </td>
  </tr>

  <!-- DETALLE ORDEN -->
  <tr>
    <td style="padding:20px 24px;background:#0f0f0f;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#171717;border:1px solid #262626;border-radius:12px;">
        <tr>
          <td style="padding:16px 18px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;letter-spacing:1px;padding-bottom:4px;">ORDEN</td>
                <td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;letter-spacing:1px;padding-bottom:4px;text-align:right;">FECHA</td>
              </tr>
              <tr>
                <td style="font-family:Arial, sans-serif;color:#fff;font-size:14px;font-weight:900;">${orderCode}</td>
                <td style="font-family:Arial, sans-serif;color:#fff;font-size:14px;font-weight:700;text-align:right;">${new Date().toLocaleDateString('es-CL')}</td>
              </tr>
              <tr><td colspan="2" style="height:12px;border-bottom:1px solid #262626;"></td></tr>
              <tr>
                <td style="padding-top:12px;font-family:Arial, sans-serif;color:#a1a1aa;font-size:13px;">Pack x${qty} • ${tickets.length} ticket(s)</td>
                <td style="padding-top:12px;font-family:Arial, sans-serif;color:#FFD700;font-size:13px;font-weight:900;text-align:right;">PAGADO - Webpay</td>
              </tr>
              <tr>
                <td style="padding-top:4px;font-family:Arial, sans-serif;color:#71717a;font-size:12px;">Enviado a: ${email}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- TICKETS -->
  <tr>
    <td style="padding:0 24px 8px;background:#0f0f0f;">
      <div style="font-family:Arial, sans-serif;color:#fff;font-size:12px;font-weight:900;letter-spacing:2px;margin:12px 0 12px;">TUS TICKETS VÁLIDOS</div>
      ${tickets.map((t,i) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;margin-bottom:10px;overflow:hidden;">
          <tr>
            <td style="width:6px;background:#E30613;"></td>
            <td style="padding:16px 18px;">
              <div style="font-family:Arial, sans-serif;color:#E30613;font-size:10px;font-weight:900;letter-spacing:1px;">TICKET #${i+1}</div>
              <div style="font-family:Courier New, monospace;color:#000;font-size:20px;font-weight:900;letter-spacing:3px;margin-top:2px;">${t}</div>
            </td>
            <td style="padding:16px 18px;text-align:right;">
              <div style="background:#000;color:#FFD700;font-family:Arial, sans-serif;font-size:10px;font-weight:900;padding:8px 12px;border-radius:6px;display:inline-block;">VÁLIDO</div>
            </td>
          </tr>
        </table>
      `).join('')}
    </td>
  </tr>

  <!-- INSTRUCCIONES -->
  <tr>
    <td style="padding:16px 24px 24px;background:#0f0f0f;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#111;border:1px dashed #27272a;border-radius:10px;">
        <tr><td style="padding:16px 18px;">
          <div style="font-family:Arial, sans-serif;color:#fff;font-size:12px;font-weight:900;margin-bottom:8px;">¿CÓMO USAR TUS TICKETS?</div>
          <div style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:12px;line-height:1.6;">
            1. Guarda este correo, es tu comprobante oficial.<br/>
            2. Presenta el o los códigos el día del evento.<br/>
            3. Llega 30 minutos antes. Orden: <b style="color:#fff;">${orderCode}</b>
          </div>
        </td></tr>
      </table>
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td style="padding:20px 24px;text-align:center;background:#000;border-top:1px solid #1f1f1f;">
      <p style="font-family:Arial, sans-serif;color:#52525b;font-size:11px;margin:0 0 8px;line-height:1.5;">¿Dudas? Responde a este correo a <a href="mailto:hola@balladares-motors.cl" style="color:#fff;text-decoration:none;">hola@balladares-motors.cl</a></p>
      <p style="font-family:Arial, sans-serif;color:#3f3f46;font-size:10px;margin:0;">Balladares Motors © 2026 - Todos los derechos reservados</p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>
`;

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
      html: getHtml(order.order_code, tickets, order.email, order.qty)
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