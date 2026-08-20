export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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
          ticketsArray = job.tickets.replace(/[{}"]/g, '').split(',').map((t:string)=>t.trim()).filter(Boolean);
        }

        console.log(`Enviando ${job.order_code} a ${job.email}`);

        const { data, error } = await resend.emails.send({
          from: 'Balladares Motors <hola@balladares-motors.cl>',
          to: job.email,
          subject: `¡Pago confirmado! Orden ${job.order_code} - Balladares Motors`,
          html: `
          <div style="background:#0a0a0a; padding:40px 0; font-family:Inter, Arial, sans-serif;">
            <div style="max-width:520px; margin:0 auto; background:#18181b; border:1px solid #27272a; border-radius:24px; overflow:hidden;">
              <div style="background:#facc15; padding:24px; text-align:center;">
                <h1 style="margin:0; font-size:22px; font-weight:900; color:#000;">BALLADARES MOTORS</h1>
              </div>
              <div style="padding:32px;">
                <p style="color:#fff;">Orden ${job.order_code}</p>
                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                  ${ticketsArray.map((t:string)=>`<div style="background:#000; border:1px dashed #facc15; border-radius:10px; padding:12px; text-align:center; color:#facc15; font-weight:900;">${t}</div>`).join('')}
                </div>
              </div>
            </div>
          </div>`
        });

        if (error) throw new Error(JSON.stringify(error));

        console.log('Enviado OK:', data?.id);
        await pool.query(`UPDATE email_jobs SET status='SENT', attempts=attempts+1 WHERE id=$1`, [job.id]);
        ok++;

      } catch (e: any) {
        console.error('MAIL FAIL', job.order_code, e.message);
        await pool.query(`UPDATE email_jobs SET attempts=attempts+1, status=CASE WHEN attempts>=4 THEN 'FAILED' ELSE 'pending' END WHERE id=$1`, [job.id]);
      }
    }

    return NextResponse.json({ processed: ok, total: rows.length });
  } catch (e: any) {
    console.error('CRON CRASH', e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}