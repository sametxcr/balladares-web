import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { TBK } from '@/lib/tbk';

const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`;

async function processPayment(token: string, req: NextRequest) {
  const client = await pool.connect();
  try {
    // 1. Confirmar con Transbank
    const tbkRes = await fetch(`${TBK.URL}/${token}`, {
      method: 'PUT',
      headers: {
        'Tbk-Api-Key-Id': TBK.ID,
        'Tbk-Api-Key-Secret': TBK.SECRET,
        'Content-Type': 'application/json'
      }
    });
    const tbk = await tbkRes.json();
    console.log('TBK COMMIT', tbk);

    if (tbk.status !== 'AUTHORIZED') {
      return NextResponse.redirect(new URL(`/?error=pago&status=${tbk.status}`, req.url));
    }

    // 2. TRANSACCIÓN BLINDADA
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

    // IDEMPOTENCIA: si ya está pagada, no crear tickets de nuevo
    if (order.status === 'PAID') {
      const tks = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id]);
      await client.query('COMMIT');
      return NextResponse.redirect(
        new URL(`/sorteos/exito?orden=${order.order_code}&tickets=${tks.rows.map((r:any)=>r.ticket_code).join(',')}`, req.url)
      );
    }

    // 3. Generar tickets sin duplicar
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
          if (e.code !== '23505') throw e; // si no es duplicado, explotar
        }
      }
    }

    await client.query(`UPDATE orders SET status='PAID' WHERE id=$1`, [order.id]);
    
    // 4. ENCOLAR EMAIL (no enviarlo aquí, no bloquea la compra)
    await client.query(
      `INSERT INTO email_jobs (order_id, email, order_code, tickets) VALUES ($1,$2,$3,$4)`,
      [order.id, order.email, order.order_code, tickets]
    );

    await client.query('COMMIT');

    // 5. Redirect rápido, el mail sale por cron
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