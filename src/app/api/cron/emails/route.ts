export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const getHtml = (orderCode: string, tickets: string[]) => `
<!DOCTYPE html><html><body style="margin:0;padding:0;background:#050505;font-family:Arial;">
<div style="max-width:600px;margin:0 auto;">
  <div style="background:#000;padding:22px;text-align:center;border-bottom:4px solid #E30613;">
    <img src="https://www.balladares-motors.cl/logo-principal.png" style="height:48px;" />
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
    <a href="https://www.balladares-motors.cl/sorteos/exito?orden=${orderCode}&tickets=${tickets.join(',')}" style="display:block;background:#FFD700;color:#000;text-align:center;padding:15px;border-radius:8px;text-decoration:none;font-weight:900;margin-top:18px;">VER MIS TICKETS →</a>
  </div>
</div></body></html>`;

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
          subject: `Tus tickets ${job.order_code} - Balladares Motors`,
          html: getHtml(job.order_code, ticketsArray)
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