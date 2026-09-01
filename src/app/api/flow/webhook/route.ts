export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY!.trim());
const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`;

// Firma oficial Flow: concatenar key+value ordenado alfabéticamente
function sign(params: any, secret: string) {
  let toSign = ""
  for (const k of Object.keys(params).sort()) {
    toSign += k + params[k]
  }
  return crypto.createHmac('sha256', secret).update(toSign).digest('hex')
}

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `
<!DOCTYPE html>
<html lang="es"><body style="margin:0;padding:0;background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">
<tr><td style="background:#000000;padding:32px 24px 20px;text-align:center;border-bottom:4px solid #E30613;">
<img src="https://www.balladares-motors.cl/BB.png" alt="Balladares Motors" style="height:72px;width:auto;display:block;margin:0 auto 14px;" />
<div style="font-family:Arial, sans-serif;color:#ffffff;font-size:11px;letter-spacing:4px;font-weight:900;opacity:0.6;">BALLADARES MOTORS</div>
</td></tr>
<tr><td style="padding:28px 32px 8px;text-align:center;background:#0f0f0f;">
<img src="https://www.balladares-motors.cl/escudo.png" style="height:64px;width:auto;display:block;margin:0 auto 16px;" />
<div style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;display:inline-block;padding:7px 18px;border-radius:100px;font-weight:900;font-size:11px;letter-spacing:1px;">✓ PAGO APROBADO</div>
<h1 style="font-family:Arial Black, Arial, sans-serif;color:#fff;margin:18px 0 8px;font-weight:900;font-size:26px;">¡Gracias por Participar!</h1>
<p style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:14px;margin:0;">Tu pago se confirmó.</p>
</td></tr>
<tr><td style="padding:20px 24px;background:#0f0f0f;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#171717;border:1px solid #262626;border-radius:12px;">
<tr><td style="padding:16px 18px;">
<table width="100%" cellpadding="0" cellspacing="0">
<tr><td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;letter-spacing:1px;padding-bottom:4px;">ORDEN</td><td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;text-align:right;padding-bottom:4px;">FECHA</td></tr>
<tr><td style="font-family:Arial, sans-serif;color:#fff;font-size:14px;font-weight:900;">${orderCode}</td><td style="font-family:Arial, sans-serif;color:#fff;font-size:14px;font-weight:700;text-align:right;">${new Date().toLocaleDateString('es-CL')}</td></tr>
<tr><td colspan="2" style="height:12px;border-bottom:1px solid #262626;"></td></tr>
<tr><td style="padding-top:12px;font-family:Arial, sans-serif;color:#a1a1aa;font-size:13px;">Pack x${qty} • ${tickets.length} ticket(s)</td><td style="padding-top:12px;font-family:Arial, sans-serif;color:#FFD700;font-size:13px;font-weight:900;text-align:right;">PAGADO</td></tr>
<tr><td style="padding-top:4px;font-family:Arial, sans-serif;color:#71717a;font-size:12px;">Enviado a: ${email}</td></tr>
</table>
</td></tr>
</table>
</td></tr>
<tr><td style="padding:0 24px 8px;background:#0f0f0f;">
<div style="font-family:Arial, sans-serif;color:#fff;font-size:12px;font-weight:900;letter-spacing:2px;margin:12px 0 12px;">TUS TICKETS VÁLIDOS</div>
${tickets.map((t,i) => `
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;margin-bottom:10px;overflow:hidden;">
<tr><td style="width:6px;background:#E30613;"></td><td style="padding:16px 18px;"><div style="font-family:Arial, sans-serif;color:#E30613;font-size:10px;font-weight:900;">TICKET #${i+1}</div><div style="font-family:Courier New, monospace;color:#000;font-size:20px;font-weight:900;letter-spacing:3px;margin-top:2px;">${t}</div></td><td style="padding:16px 18px;text-align:right;"><div style="background:#000;color:#FFD700;font-family:Arial, sans-serif;font-size:10px;font-weight:900;padding:8px 12px;border-radius:6px;display:inline-block;">VÁLIDO</div></td></tr>
</table>`).join('')}
</td></tr>
<tr><td style="padding:20px 24px;text-align:center;background:#000;border-top:1px solid #1f1f1f;">
<p style="font-family:Arial, sans-serif;color:#52525b;font-size:11px;margin:0;">¿Dudas? <a href="mailto:hola@balladares-motors.cl" style="color:#fff;text-decoration:none;">hola@balladares-motors.cl</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;

export async function POST(req: NextRequest) {
  const client = await pool.connect();
  try {
    const form = await req.formData();
    const rawToken = (form.get('token') as string) || ''
    const token = rawToken.replace(/ /g, '+').trim()
    if (!token) return NextResponse.json({ ok: true, noToken: true });

    const apiKey = process.env.FLOW_API_KEY!.trim();
    const secret = process.env.FLOW_SECRET_KEY!.trim();

    const params: any = { apiKey, token };
    const s = sign(params, secret);
    const body = new URLSearchParams({ apiKey, token, s });

    console.log('WEBHOOK TO FLOW', { token, toSign: `apiKey${apiKey}token${token}`, s })

    const FLOW_API_URL = process.env.FLOW_ENV === 'sandbox' ? 'https://sandbox.flow.cl/api' : 'https://www.flow.cl/api'
const statusRes = await fetch(`${FLOW_API_URL}/payment/getStatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    const flowData = await statusRes.json();
    console.log('FLOW STATUS', flowData, 'HTTP', statusRes.status, 'TOKEN', token.slice(0,15));

    if (flowData.status!== 2) {
      console.log('Pago no aprobado', flowData);
      return NextResponse.json({ ok: true, status: flowData.status, flowData });
    }

    const orderCode = flowData.commerceOrder;
    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [orderCode]);
    const order = rows[0];
    if (!order) { await client.query('ROLLBACK'); return NextResponse.json({ error: 'orden no encontrada' }, { status: 404 }); }

    if (order.status === 'PAID') {
      await client.query('COMMIT');
      return NextResponse.json({ ok: true, alreadyPaid: true });
    }

    const tickets: string[] = [];
    const qty = order.qty || order.quantity || 1;
    for (let i=0; i<qty; i++) {
      let ok=false;
      while(!ok){
        const code=genCode();
        try{
          await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email]);
          ok=true; tickets.push(code);
        } catch(e:any){ if(e.code!=='23505') throw e; }
      }
    }

    await client.query(`UPDATE orders SET status='PAID', flow_token=$2, flow_order=$3 WHERE id=$1`, [order.id, token, String(flowData.flowOrder)]);
    await client.query(`INSERT INTO email_jobs (order_id, order_code, email, tickets, status) VALUES ($1,$2,$3,$4,'pending')`, [order.id, order.order_code, order.email, tickets]);
    await client.query('COMMIT');

    console.log('ENVIANDO MAIL FLOW...', order.email, tickets);
    const { data, error } = await resend.emails.send({
      from: 'Balladares Motors <hola@balladares-motors.cl>',
      to: order.email,
      subject: `Tus tickets ${order.order_code} - Balladares Motors`,
      html: getHtml(order.order_code, tickets, order.email, qty)
    });

    if (error) {
      console.error('RESEND ERROR FLOW', error);
    } else {
      console.log('MAIL FLOW ENVIADO', data);
      await pool.query(`UPDATE email_jobs SET status='SENT' WHERE order_id=$1 AND status='pending'`, [order.id]);
    }

    return NextResponse.json({ ok: true, tickets });

  } catch (e:any) {
    try { await client.query('ROLLBACK'); } catch {}
    console.error('WEBHOOK FLOW CRASH', e);
    return NextResponse.json({ ok: true });
  } finally { client.release(); }
}