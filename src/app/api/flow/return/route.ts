export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server'
import { pool } from '@/lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'

const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`

const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `<!DOCTYPE html>
<html lang="es">
<body style="margin:0;padding:0;background-color:#f4f4f5;">
<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:24px 0;">
<tr><td align="center">
<table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#111111;border-radius:16px;overflow:hidden;border:1px solid #1f1f1f;">
  <tr>
    <td style="background:#000000;padding:32px 24px 24px;text-align:center;border-bottom:3px solid #E30613;">
      <img src="https://www.balladares-motors.cl/BB.png" alt="Balladares Motors" style="height:64px;width:auto;display:block;margin:0 auto 12px;" />
      <div style="font-family:Arial, sans-serif;color:#ffffff;font-size:11px;letter-spacing:4px;font-weight:900;opacity:0.7;">BALLADARES MOTORS</div>
    </td>
  </tr>
  <tr>
    <td style="padding:32px 24px 8px;text-align:center;background:#111111;">
      <img src="https://www.balladares-motors.cl/escudo.png" style="height:64px;width:auto;display:block;margin:0 auto 16px;" />
      <div style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;display:inline-block;padding:8px 20px;border-radius:100px;font-weight:900;font-size:12px;letter-spacing:0.5px;">✓ PAGO APROBADO</div>
      <h1 style="font-family:Arial Black, Arial, sans-serif;color:#fff;margin:18px 0 8px;font-weight:900;font-size:28px;line-height:1.1;letter-spacing:-0.5px;">¡Gracias por Participar!</h1>
      <p style="font-family:Arial, sans-serif;color:#a1a1aa;font-size:14px;margin:0;line-height:1.5;">Tu pago se confirmó. Aquí tienes el detalle de tu orden.</p>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 24px;background:#111111;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border:1px solid #262626;border-radius:12px;">
        <tr>
          <td style="padding:16px 18px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;letter-spacing:1px;padding-bottom:6px;">ORDEN</td>
                <td style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;font-weight:700;letter-spacing:1px;padding-bottom:6px;text-align:right;">FECHA</td>
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
                <td colspan="2" style="padding-top:6px;font-family:Arial, sans-serif;color:#71717a;font-size:12px;">Enviado a: <span style="color:#60a5fa;">${email}</span></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:8px 24px 8px;background:#111111;">
      <div style="font-family:Arial, sans-serif;color:#fff;font-size:12px;font-weight:900;letter-spacing:2px;margin:16px 0 12px;">TUS TICKETS VÁLIDOS</div>
      ${tickets.map((t,i) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;margin-bottom:10px;overflow:hidden;">
          <tr>
            <td style="width:6px;background:#E30613;"></td>
            <td style="padding:16px 18px;">
              <div style="font-family:Arial, sans-serif;color:#E30613;font-size:11px;font-weight:900;letter-spacing:1px;">TICKET #${i+1}</div>
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
   <!-- BLOQUE NUEVO - DESCARGA STICKERS -->
  <tr>
    <td style="padding:0 24px 16px;background:#111111;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#1a1a1a,#222);border:1px solid #FFD700;border-radius:12px;">
        <tr>
          <td style="padding:20px;text-align:center;">
            <div style="font-family:Arial Black, Arial, sans-serif;color:#FFD700;font-size:14px;font-weight:900;letter-spacing:1px;margin-bottom:6px;">🎁 REGALO EXCLUSIVO</div>
            <div style="font-family:Arial, sans-serif;color:#fff;font-size:13px;font-weight:700;margin-bottom:16px;">Pack de Stickers Balladares Motors</div>
            <a href="https://www.balladares-motors.cl/stickers-pack.zip" target="_blank" style="background:#FFD700;color:#000;font-family:Arial Black, Arial, sans-serif;font-size:13px;font-weight:900;padding:14px 28px;border-radius:100px;text-decoration:none;display:inline-block;letter-spacing:0.5px;">⬇ DESCARGAR STICKERS.ZIP</a>
            <div style="font-family:Arial, sans-serif;color:#71717a;font-size:11px;margin-top:10px;">Incluye todos los diseños en alta calidad</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:16px 24px 24px;background:#111111;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#161616;border:1px dashed #2a2a2a;border-radius:10px;">
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
      <p style="font-family:Arial, sans-serif;color:#52525b;font-size:11px;margin:0 0 8px;line-height:1.5;">¿Dudas? Responde a este correo a <a href="mailto:hola@balladares-motors.cl" style="color:#fff;text-decoration:none;font-weight:700;">hola@balladares-motors.cl</a></p>
      <p style="font-family:Arial, sans-serif;color:#3f3f46;font-size:10px;margin:0;">Balladares Motors © 2026 - Todos los derechos reservados</p>
    </td>
  </tr>
</table>
</td></tr>
</table>
</body>
</html>`;

async function processOrder(rawToken: string, orderFromUrl: string) {
  const token = rawToken.replace(/ /g, '+').trim()
  if (!token ||!orderFromUrl) return { orderCode: orderFromUrl, paid: false }

  const apiKey = process.env.FLOW_API_KEY!.trim()
  const secret = process.env.FLOW_SECRET_KEY!.trim()
  const flowUrl = process.env.FLOW_ENV === 'sandbox'
   ? 'https://sandbox.flow.cl/api/payment/getStatus'
    : 'https://www.flow.cl/api/payment/getStatus'

  let toSign = ""; const params:any={apiKey, token}
  for (const k of Object.keys(params).sort()) toSign += k + params[k]
  const s = crypto.createHmac('sha256', secret).update(toSign).digest('hex')
  const body = new URLSearchParams({ apiKey, token, s })

  const r = await fetch(flowUrl, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
  const data = await r.json()
  console.log('FLOW STATUS', data.status, data)

  if (data.status!== 2) return { orderCode: data.commerceOrder || orderFromUrl, paid: false }

  const orderCode = data.commerceOrder || orderFromUrl
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const { rows } = await client.query(`SELECT * FROM orders WHERE order_code=$1 FOR UPDATE`, [orderCode])
    const order = rows[0]
    if (!order) { await client.query('ROLLBACK'); return { orderCode, paid: false } }
    if (order.status === 'PAID') {
      const t = await client.query(`SELECT ticket_code FROM tickets WHERE order_id=$1`, [order.id])
      await client.query('COMMIT')
      return { orderCode, paid: true, tickets: t.rows.map((x:any)=>x.ticket_code), email: order.email }
    }
    const qty = order.qty || 1
    const tickets: string[] = []
    for (let i=0;i<qty;i++){
      let ok=false
      while(!ok){
        const code=genCode()
        try{
          await client.query(`INSERT INTO tickets (ticket_code, order_id, email) VALUES ($1,$2,$3)`, [code, order.id, order.email])
          ok=true; tickets.push(code)
        } catch(e:any){ if(e.code!=='23505') throw e }
      }
    }
    await client.query(`UPDATE orders SET status='PAID', flow_token=$2 WHERE id=$1`, [order.id, token])
    await client.query('COMMIT')

    const resend = new Resend(process.env.RESEND_API_KEY!.trim())
    resend.emails.send({
      from: 'Balladares Motors <hola@balladares-motors.cl>',
      to: order.email,
      subject: `Tus tickets ${order.order_code}`,
      html: getHtml(order.order_code, tickets, order.email, qty)
    }).catch(e=>console.error('RESEND', e))

    return { orderCode, paid: true, tickets, email: order.email }
  } catch(e){ await client.query('ROLLBACK'); throw e } finally { client.release() }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawToken = searchParams.get('token') || ''
  const orderFromUrl = searchParams.get('order') || ''
  const result = await processOrder(rawToken, orderFromUrl)
  if(!result.paid){ return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}&pending=1`, 303) }
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}&token=${rawToken}`, 303)
}
export async function POST(req: NextRequest) {
  const form = await req.formData()
  const rawToken = (form.get('token') as string) || ''
  const orderFromUrl = new URL(req.url).searchParams.get('order') || ''
  return GET(new NextRequest(`${req.nextUrl.origin}${req.nextUrl.pathname}?token=${encodeURIComponent(rawToken)}&order=${orderFromUrl}`))
}