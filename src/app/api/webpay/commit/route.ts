export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { WebpayPlus, Options, Environment, IntegrationCommerceCodes, IntegrationApiKeys } from 'transbank-sdk';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);
const genCode = () => `BM${Math.floor(1000000 + Math.random()*9000000)}`;

// FIX LOGOS: PARA CORREO SIEMPRE USAR PRODUCCION, NO LOCALHOST
function getBase(req: NextRequest){
  const prod = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, '');
  // Si estas en local igual usa produccion para que Gmail vea las imagenes
  if(prod && prod.includes('localhost')) return 'https://www.balladares-motors.cl';
  return prod || 'https://www.balladares-motors.cl';
}

async function processOrder(token_ws: string, req: NextRequest) {
  const base = getBase(req);
  const origin = req.nextUrl.origin; // para los redirect nomas

  const isLive = process.env.TBK_ENV === 'LIVE';
  const options = isLive
   ? new Options(process.env.TBK_API_KEY_ID!.trim(), process.env.TBK_API_KEY_SECRET!.trim(), Environment.Production)
    : new Options(IntegrationCommerceCodes.WEBPAY_PLUS, IntegrationApiKeys.WEBPAY, Environment.Integration);

  const tx = new WebpayPlus.Transaction(options);
  const commit: any = await tx.commit(token_ws);

  const buyOrder = commit.buyOrder || commit.buy_order;
  const responseCode = commit.response_code?? commit.responseCode;

  if (responseCode!== 0) {
    if (buyOrder) await pool.query(`UPDATE orders SET status='FAILED' WHERE order_code=$1`, [buyOrder]);
    return { ok: false, order: buyOrder, origin };
  }
  if (!buyOrder) throw new Error('buyOrder undefined');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [buyOrder]);
    if (!rows[0]) throw new Error(`Orden no existe: ${buyOrder}`);
    const order = rows[0];

    if (order.status === 'PAID') {
      await client.query('COMMIT');
      return { ok: true, order: order.order_code, origin };
    }

    const tickets: string[] = [];
    for (let i = 0; i < order.qty; i++) {
      let inserted = false;
      while (!inserted) {
        const code = genCode();
        try {
          await client.query(`INSERT INTO tickets(ticket_code, order_id, email) VALUES($1,$2,$3)`, [code, order.id, order.email]);
          tickets.push(code);
          inserted = true;
        } catch (e: any) {
          if (e.code!== '23505') throw e;
        }
      }
    }

    await client.query(`UPDATE orders SET status='PAID' WHERE id=$1`, [order.id]);
    await client.query('COMMIT');

    const fecha = new Date().toLocaleDateString('es-CL', { day:'2-digit', month:'2-digit', year:'numeric' });
    const packLabel = order.pack_id === 'x4'? `Pack x4 • ${tickets.length} ticket(s)` : `Pack x1 • ${tickets.length} ticket(s)`;

    try {
      await resend.emails.send({
        from: 'Balladares Motors <hola@balladares-motors.cl>',
        to: order.email,
        subject: `${order.order_code} - Tus tickets Balladares Motors`,
        html: `
<div style="margin:0;padding:0;background:#efefef;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#0a0a0a;border-radius:24px;overflow:hidden;">
    <div style="padding:32px 24px 16px;text-align:center;background:#0a0a0a;">
      <img src="${base}/BB.png" width="250" style="width:250px;height:auto;margin:0 auto;display:block;" />
      <p style="color:#666;letter-spacing:4px;font-size:10px;font-weight:900;margin:14px 0 0 0;">BALLADARES MOTORS</p>
    </div>
    <div style="height:3px;background:#e11d48;width:100%;"></div>
    <div style="padding:32px 24px;text-align:center;background:#0a0a0a;">
      <img src="${base}/escudo.png" width="72" height="72" alt="OK" style="width:72px;height:72px;margin:0 auto 16px;display:block;" />
      <div style="display:inline-block;background:#FFD600;color:#000;font-weight:900;font-size:12px;letter-spacing:1px;padding:10px 22px;border-radius:999px;margin-bottom:20px;">✓ PAGO APROBADO</div>
      <h1 style="color:#fff;font-size:28px;font-weight:900;margin:0 0 8px 0;line-height:1.1;">¡Gracias por Participar!</h1>
      <p style="color:#9ca3af;font-size:14px;margin:0 0 28px 0;">Tu pago se confirmó. Aquí tienes el detalle de tu orden.</p>

      <div style="background:#161616;border:1px solid #262626;border-radius:16px;padding:18px;text-align:left;margin-bottom:22px;">
        <div style="display:flex;justify-content:space-between;"><span style="color:#666;font-size:11px;letter-spacing:1px;font-weight:700;">ORDEN</span><span style="color:#666;font-size:11px;letter-spacing:1px;font-weight:700;">FECHA</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:6px;"><span style="color:#fff;font-weight:900;font-size:14px;word-break:break-all;">${order.order_code}</span><span style="color:#fff;font-weight:700;font-size:14px;">${fecha}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;align-items:center;"><span style="color:#aaa;font-size:13px;">${packLabel}</span><span style="color:#FFD600;font-weight:900;font-size:11px;">PAGADO - Webpay</span></div>
        <div style="margin-top:6px;color:#666;font-size:12px;">Enviado a: <a href="mailto:${order.email}" style="color:#60a5fa;text-decoration:none;">${order.email}</a></div>
      </div>

      <div style="text-align:left;color:#fff;font-weight:900;letter-spacing:2px;font-size:12px;margin-bottom:10px;">TUS CÓDIGOS</div>
      ${tickets.map((t,i)=>`
        <div style="background:#ffffff;border-radius:12px;padding:14px 16px;display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-left:6px solid #e11d48;">
          <div><div style="color:#888;font-size:10px;letter-spacing:1px;font-weight:800;">TICKET #${i+1}</div><div style="color:#000;font-family:monospace;font-weight:900;font-size:19px;letter-spacing:2px;margin-top:2px;">${t}</div></div>
          <div style="background:#000;color:#FFD600;font-weight:900;font-size:10px;padding:8px 14px;border-radius:8px;letter-spacing:1px;">VÁLIDO</div>
        </div>
      `).join('')}

      <div style="background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:24px;text-align:center;margin-top:24px;">
        <div style="font-size:28px;line-height:1;">🎁</div>
        <div style="color:#fff;font-weight:900;letter-spacing:2px;font-size:13px;margin:10px 0 4px 0;">BONUS EXCLUSIVO</div>
        <div style="color:#888;font-size:13px;margin-bottom:18px;">Pack de Stickers Oficiales HD</div>
        <a href="${base}/stickers-pack.zip" style="display:inline-block;background:#ffffff;color:#000000;font-weight:900;font-size:13px;padding:14px 28px;border-radius:999px;text-decoration:none;letter-spacing:0.5px;">DESCARGAR PACK.ZIP</a>
      </div>

    </div>
    <div style="padding:20px;text-align:center;background:#0a0a0a;">
      <p style="color:#777;font-size:11px;margin:0;">Guarda este correo. Presenta tus códigos el día del evento.</p>
      <p style="color:#777;font-size:11px;margin:6px 0 0 0;">¿Dudas? <a href="mailto:hola@balladares-motors.cl" style="color:#fff;text-decoration:none;font-weight:700;">hola@balladares-motors.cl</a></p>
      <p style="color:#444;font-size:10px;margin:16px 0 0 0;">Balladares Motors © 2026 — Chiguayante, Bío Bío</p>
    </div>
  </div>
</div>`
      });
      console.log('[EMAIL] enviado a', order.email);
    } catch (e) { console.error('[RESEND FAIL]', e); }

    return { ok: true, order: order.order_code, origin };
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const token_ws = form.get('token_ws') as string;
    const TBK_TOKEN = form.get('TBK_TOKEN') as string;
    if (TBK_TOKEN ||!token_ws) return NextResponse.redirect(`${req.nextUrl.origin}/`);
    const result = await processOrder(token_ws, req);
    if (!result.ok) return NextResponse.redirect(`${result.origin}/`);
    return NextResponse.redirect(`${result.origin}/ventasticker/gracias?orden=${result.order}&token=${token_ws}`);
  } catch (e: any) {
    console.error('COMMIT FATAL', e.message);
    return NextResponse.redirect(`${getBase(req)}/ventasticker/fallido`);
  }
}

export async function GET(req: NextRequest) {
  try {
    const token_ws = req.nextUrl.searchParams.get('token_ws');
    const TBK_TOKEN = req.nextUrl.searchParams.get('TBK_TOKEN');
    if (TBK_TOKEN ||!token_ws) return NextResponse.redirect(`${req.nextUrl.origin}/`);
    const result = await processOrder(token_ws!, req);
    if (!result.ok) return NextResponse.redirect(`${result.origin}/`);
    return NextResponse.redirect(`${result.origin}/ventasticker/gracias?orden=${result.order}&token=${token_ws}`);
  } catch (e: any) {
    console.error('COMMIT FATAL GET', e.message);
    return NextResponse.redirect(`${getBase(req)}/ventasticker/fallido`);
  }
}