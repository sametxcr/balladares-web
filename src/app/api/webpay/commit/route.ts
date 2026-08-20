export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

if (process.env.TRANSBANK_ENV === 'INTEGRATION' || process.env.TBK_ENV === 'INTEGRATION') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { TBK } from '@/lib/tbk';
import { Resend } from 'resend';
import https from 'https';

const resend = new Resend(process.env.RESEND_API_KEY);
const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    
    const tbkRes = await fetch(`${TBK.URL}/${token}`, {
      method: 'PUT',
      // @ts-ignore
      agent,
      headers: {
        'Tbk-Api-Key-Id': TBK.ID,
        'Tbk-Api-Key-Secret': TBK.SECRET,
        'Content-Type': 'application/json'
      }
    } as any);
    
    const tbk = await tbkRes.json();
    console.log('TBK COMMIT', tbk);

    if (tbk.status !== 'AUTHORIZED') {
      return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status}`, req.url));
    }

    await client.query('BEGIN');
    const { rows } = await client.query(
      `SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`,
      [tbk.buy_order]
    );

    if (!rows[0]) {
      await client.query('ROLLBACK');
      return NextResponse.redirect(new URL('/?error=orden_no_encontrada', req.url));
    }
    const order = rows[0];

    if (order.status === 'PAID') {
      const tks = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id]);
      await client.query('COMMIT');
      return NextResponse.redirect(
        new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tks.rows.map((r:any)=>r.ticket_code).join(',')}`, req.url)
      );
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
        from: 'Balladares Motors <sorteos@balladares-motors.cl>',
        to: order.email,
        subject: `¡Tus tickets Balladares! ${order.order_code}`,
        html: `
          <div style="background:#000;color:#fff;padding:30px;font-family:Arial">
            <h1 style="font-style:italic;font-weight:900;">¡PAGO CONFIRMADO!</h1>
            <p>Orden: <b>${order.order_code}</b></p>
            <p>Tus tickets:</p>
            <h2 style="letter-spacing:2px">${tickets.join(', ')}</h2>
            <p>Guarda este correo, tus códigos empiezan con BM</p>
          </div>
        `
      });
      emailSent = true;
    } catch (e) {
      console.error('RESEND FAIL, va a cron', e);
    }

    if (!emailSent) {
      await client.query(
        `INSERT INTO email_jobs (order_id, email, order_code, tickets) VALUES ($1,$2,$3,$4)`,
        [order.id, order.email, order.order_code, tickets]
      );
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