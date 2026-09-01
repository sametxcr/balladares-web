export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'

const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`
function sign(params: any, secret: string) {
  const cleanSecret = secret.trim().replace(/\n|\r/g, '').replace(/\s/g, '')
  const toSign = Object.keys(params).sort().map(k => `${k}${String(params[k]).trim()}`).join('')
  return crypto.createHmac('sha256', cleanSecret).update(toSign).digest('hex')
}

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `
<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:32px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:20px;overflow:hidden;border:1px solid #232323;box-shadow:0 20px 60px rgba(0,0,0,0.8);">
  <tr><td style="background:radial-gradient(circle at top, #1f1f1f 0%, #000000 70%);padding:36px 24px 28px;text-align:center;border-bottom:1px solid #222;">
      <img src="https://www.balladares-motors.cl/BB.png" alt="Balladares Motors" style="height:52px;width:auto;display:block;margin:0 auto 18px;" />
      <div style="font-family:Arial, sans-serif;color:#E30613;font-size:10px;letter-spacing:5px;font-weight:900;">BALLADARES MOTORS</div>
  </td></tr>
  <tr><td style="padding:32px 32px 0;background:#111111;text-align:center;">
      <div style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;display:inline-block;padding:9px 22px;border-radius:100px;font-weight:900;font-size:11px;letter-spacing:1px;">✓ PAGO CONFIRMADO</div>
      <h1 style="font-family:Arial Black, Arial, sans-serif;color:#fff;margin:20px 0 8px;font-weight:900;font-size:30px;line-height:1.1;">¡Estás dentro!</h1>
      <p style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:14px;margin:0;line-height:1.5;">Tus tickets ya son válidos. Guárdalos bien.</p>
  </td></tr>
  <tr><td style="padding:24px 24px 0;background:#111111;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#171717;border:1px solid #262626;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:18px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial, sans-serif;color:#52525b;font-size:10px;font-weight:900;letter-spacing:1.5px;">ORDEN</td>
                <td style="font-family:Arial, sans-serif;color:#52525b;font-size:10px;font-weight:900;letter-spacing:1.5px;text-align:right;">TOTAL</td>
              </tr>
              <tr>
                <td style="font-family:Courier New, monospace;color:#fff;font-size:15px;font-weight:900;padding-top:4px;">${orderCode}</td>
                <td style="font-family:Arial, sans-serif;color:#FFD700;font-size:14px;font-weight:900;text-align:right;padding-top:4px;">x${qty} • PAGADO</td>
              </tr>
              <tr><td colspan="2" style="height:1px;background:#262626;display:block;margin-top:14px;"></td></tr>
              <tr>
                <td colspan="2" style="padding-top:10px;font-family:Arial, sans-serif;color:#71717a;font-size:12px;">Enviado a <span style="color:#fff;font-weight:700;">${email}</span> • ${new Date().toLocaleDateString('es-CL')}</td>
              </tr>
            </table>
        </td></tr>
      </table>
  </td></tr>
  <tr><td style="padding:28px 24px 0;background:#111111;">
      <div style="font-family:Arial, sans-serif;color:#fff;font-size:11px;font-weight:900;letter-spacing:2px;margin-bottom:14px;">TUS CÓDIGOS</div>
      ${tickets.map((t,i) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;margin-bottom:10px;overflow:hidden;">
          <tr>
            <td style="width:5px;background:#E30613;"></td>
            <td style="padding:16px 18px;">
              <div style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:10px;font-weight:900;letter-spacing:1px;">TICKET #${i+1}</div>
              <div style="font-family:Courier New, monospace;color:#000;font-size:20px;font-weight:900;letter-spacing:3px;margin-top:2px;">${t}</div>
            </td>
            <td style="padding:16px 18px;text-align:right;">
              <div style="background:#000;color:#fff;font-family:Arial, sans-serif;font-size:9px;font-weight:900;padding:7px 11px;border-radius:100px;display:inline-block;letter-spacing:1px;">VÁLIDO</div>
            </td>
          </tr>
        </table>
      `).join('')}
  </td></tr>
  <tr><td style="padding:24px;background:#111111;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a1a 0%,#1f1f1f 100%);border:1px solid #2a2a2a;border-radius:14px;overflow:hidden;">
        <tr><td style="padding:22px;text-align:center;">
            <div style="font-family:Arial, sans-serif;color:#FFD700;font-size:20px;margin-bottom:6px;">🎁</div>
            <div style="font-family:Arial Black, Arial, sans-serif;color:#fff;font-size:13px;font-weight:900;letter-spacing:1px;">BONUS EXCLUSIVO</div>
            <div style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:12px;margin:6px 0 16px;">Pack de Stickers Oficiales HD</div>
            <a href="https://www.balladares-motors.cl/stickers-pack.zip" target="_blank" style="background:#fff;color:#000;font-family:Arial Black, Arial, sans-serif;font-size:12px;font-weight:900;padding:13px 26px;border-radius:100px;text-decoration:none;display:inline-block;">DESCARGAR PACK.ZIP</a>
        </td></tr>
      </table>
  </td></tr>
  <tr><td style="padding:20px 24px 28px;text-align:center;background:#000;border-top:1px solid #1a1a1a;">
      <p style="font-family:Arial, sans-serif;color:#3f3f46;font-size:11px;margin:0;line-height:1.6;">Guarda este correo. Presenta tus códigos el día del evento.<br/>¿Dudas? <a href="mailto:hola@balladares-motors.cl" style="color:#fff;text-decoration:none;font-weight:700;">hola@balladares-motors.cl</a></p>
      <p style="font-family:Arial, sans-serif;color:#27272a;font-size:10px;margin:12px 0 0;">Balladares Motors © 2026 — Chiguayante, Bío Bío</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>
`;

async function processOrder(rawToken: string, orderFromUrl: string) {
  const token = rawToken.replace(/ /g, '+').trim().split('?')[0].split('&')[0].split(' ')[0] || ''
  let finalOrder = orderFromUrl
  if (process.env.FLOW_ENV!== 'sandbox') {
    if (!token) return { orderCode: orderFromUrl, paid: false }
    try {
      const apiKey = process.env.FLOW_API_KEY!.trim()
      const secret = process.env.FLOW_SECRET_KEY!.trim()
      const params: any = { apiKey, token }; params.s = sign(params, secret)
      const r = await fetch(`https://www.flow.cl/api/payment/getStatus`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(params), cache: 'no-store' })
      const text = await r.text(); let data:any; try{ data=JSON.parse(text)}catch{ data={status:0}}
      if (data.status!== 2) return { orderCode: data.commerceOrder || orderFromUrl, paid: false }
      finalOrder = data.commerceOrder || orderFromUrl
    } catch(e){ return { orderCode: orderFromUrl, paid: false } }
  }
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [finalOrder])
    const order = rows[0]; if (!order) { await client.query('ROLLBACK'); return { orderCode: finalOrder, paid: false } }
    if (order.status === 'PAID') { await client.query('COMMIT'); return { orderCode: order.order_code, paid: true } }
    const qty = order.qty || 1; const tickets: string[] = []
    for (let i=0;i<qty;i++){ let ok=false; while(!ok){ const code=genCode(); try{ await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email]); ok=true; tickets.push(code)}catch(e:any){ if(e.code!=='23505') throw e } } }
    await client.query(`UPDATE orders SET status='PAID', flow_token=$2 WHERE id=$1`, [order.id, token])
    await client.query('COMMIT')
    try { const resend = new Resend(process.env.RESEND_API_KEY!.trim()); await resend.emails.send({ from: 'Balladares Motors <hola@balladares-motors.cl>', to: order.email, subject: `Tus tickets ${order.order_code} — Balladares Motors`, html: getHtml(order.order_code, tickets, order.email, qty) })}catch(e){ console.error(e)}
    return { orderCode: order.order_code, paid: true }
  } catch(e){ await client.query('ROLLBACK'); throw e } finally { client.release() }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url); const result = await processOrder(searchParams.get('token') || '', searchParams.get('order') || '')
  if(!result.paid) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}&pending=1`, 303)
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}`, 303)
}
export async function POST(req: NextRequest) {
  const form = await req.formData().catch(()=>null); const rawToken = (form?.get('token') as string) || ''; const orderFromUrl = new URL(req.url).searchParams.get('order') || ''
  return GET(new NextRequest(`${req.nextUrl.origin}${req.nextUrl.pathname}?token=${encodeURIComponent(rawToken)}&order=${orderFromUrl}`))
}