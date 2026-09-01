export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `
<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0a0a0a;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">
  <tr>
    <td style="background:#000000;padding:32px 24px 20px;text-align:center;border-bottom:4px solid #E30613;">
      <img src="https://www.balladares-motors.cl/BB.png" alt="Balladares Motors" style="height:72px;width:auto;display:block;margin:0 auto 14px;" />
      <div style="font-family:Arial, sans-serif;color:#ffffff;font-size:11px;letter-spacing:4px;font-weight:900;opacity:0.6;">BALLADARES MOTORS</div>
    </td>
  </tr>
  <tr>
    <td style="padding:28px 32px 8px;text-align:center;background:#0f0f0f;">
      <img src="https://www.balladares-motors.cl/escudo.png" style="height:64px;width:auto;display:block;margin:0 auto 16px;" />
      <div style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;display:inline-block;padding:7px 18px;border-radius:100px;font-weight:900;font-size:11px;letter-spacing:1px;">✓ PAGO APROBADO</div>
      <h1 style="font-family:Arial Black, Arial, sans-serif;color:#fff;margin:18px 0 8px;font-weight:900;font-size:26px;line-height:1.1;">¡Gracias por Participar!</h1>
      <p style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:14px;margin:0;line-height:1.5;">Tu pago se confirmó. Aquí tienes el detalle de tu orden.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 24px;background:#0f0f0f;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#171717;border:1px solid #262626;border-radius:12px;">
        <tr><td style="padding:16px 18px;">
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
              <tr><td style="padding-top:4px;font-family:Arial, sans-serif;color:#71717a;font-size:12px;">Enviado a: ${email}</td></tr>
            </table>
        </td></tr>
      </table>
    </td>
  </tr>
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
  <tr>
    <td style="padding:20px 24px;text-align:center;background:#000;border-top:1px solid #1f1f1f;">
      <p style="font-family:Arial, sans-serif;color:#52525b;font-size:11px;margin:0 0 8px;line-height:1.5;">¿Dudas? hablanos al WhatsApp en nuestra pagina oficial <a href="www.balladares-motors.cl" style="color:#fff;text-decoration:none;">hola@balladares-motors.cl</a></p>
      <p style="font-family:Arial, sans-serif;color:#3f3f46;font-size:10px;margin:0;">Balladares Motors © 2026 - Todos los derechos reservados</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>
`;

export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM email_jobs WHERE LOWER(status) = 'pending' AND attempts < 5 ORDER BY id ASC LIMIT 10`
    );

    if (rows.length === 0) {
      return NextResponse.json({ processed: 0, msg: 'nada pendiente' });
    }

    let ok = 0;
    for (const job of rows) {
      try {
        let ticketsArray: string[] = [];
        if (Array.isArray(job.tickets)) {
          ticketsArray = job.tickets;
        } else if (typeof job.tickets === 'string') {
          try { ticketsArray = JSON.parse(job.tickets); } 
          catch { ticketsArray = job.tickets.replace(/[{}"]/g, '').split(',').map((t:string)=>t.trim()).filter(Boolean); }
        }

        const { error } = await resend.emails.send({
          from: 'Balladares Motors <hola@balladares-motors.cl>',
          to: job.email,
          subject: `Tus ${ticketsArray.length} tickets ${job.order_code} - Balladares Motors`,
          html: getHtml(job.order_code, ticketsArray, job.email, ticketsArray.length)
        });

        if (error) throw error;

        await pool.query(`UPDATE email_jobs SET status='SENT', attempts=attempts+1 WHERE id=$1`, [job.id]);
        ok++;

      } catch (e: any) {
        console.error('CRON MAIL ERROR', job.order_code, e);
        await pool.query(`UPDATE email_jobs SET attempts=attempts+1, status=CASE WHEN attempts>=10 THEN 'FAILED' ELSE 'pending' END WHERE id=$1`, [job.id]);
      }
    }

    return NextResponse.json({ processed: ok, total: rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}