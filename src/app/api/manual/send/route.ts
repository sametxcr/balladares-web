export const runtime = 'nodejs'
import { pool } from '@/lib/db'
import { Resend } from 'resend'

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `<!DOCTYPE html><html><body>Orden ${orderCode} - Tickets: ${tickets.join(', ')} para ${email} x${qty}</body></html>`

export async function GET(req: Request){
  const orderCode = new URL(req.url).searchParams.get('order') || 'BM1788239960466'
  const { rows } = await pool.query(`SELECT o.*, array_agg(t.ticket_code) as tickets FROM orders o LEFT JOIN tickets t ON t.order_id=o.id WHERE o.order_code=$1 GROUP BY o.id`, [orderCode])
  const o = rows[0]
  if(!o) return new Response('no orden')
  const resend = new Resend(process.env.RESEND_API_KEY!.trim())
  await resend.emails.send({
    from: 'Balladares Motors <hola@balladares-motors.cl>',
    to: o.email,
    subject: `Tus tickets ${o.order_code}`,
    html: `<!DOCTYPE html><html><body style="background:#111;color:#fff;padding:20px;font-family:Arial">
    <h1>Gracias por participar!</h1>
    <p>Orden: <b>${o.order_code}</b></p>
    <p>Tickets:</p>
    <ul>${o.tickets.filter(Boolean).map((t:string)=>`<li style="font-size:20px"><b>${t}</b></li>`).join('')}</ul>
    <p>Pack x${o.qty}</p>
    <a href="https://www.balladares-motors.cl/stickers-pack.zip" style="background:#FFD700;color:#000;padding:12px 20px;border-radius:20px;text-decoration:none;font-weight:900">⬇ DESCARGAR STICKERS</a>
    </body></html>`
  })
  return new Response('correo enviado a '+o.email+' tickets '+o.tickets)
}