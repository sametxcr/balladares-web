export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto'

const genCode = () => `BM${Math.floor(1000000 + Math.random() * 9000000)}`
const getHtml = (orderCode: string, tickets: string[], email: string, qty: number) => `...tu mismo html, no lo toques...`;

async function processOrder(rawToken: string, orderFromUrl: string) {
  const token = rawToken.replace(/ /g, '+').trim()
  const apiKey = process.env.FLOW_API_KEY!.trim()
  const secret = process.env.FLOW_SECRET_KEY!.trim()

  let flowData: any = { status: 2, commerceOrder: orderFromUrl } // default para sandbox

  if (process.env.FLOW_ENV!== 'sandbox') {
    let toSign = ""; const params:any={apiKey, token};
    for (const k of Object.keys(params).sort()) toSign += k + params[k]
    const s = crypto.createHmac('sha256', secret).update(toSign).digest('hex')
    const body = new URLSearchParams({ apiKey, token, s })
    const url = process.env.FLOW_ENV === 'sandbox'? 'https://sandbox.flow.cl/api/payment/getStatus' : 'https://www.flow.cl/api/payment/getStatus'
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body })
    flowData = await r.json()
    console.log('FLOW STATUS', flowData)
    if (flowData.status!== 2) return { orderCode: flowData.commerceOrder || orderFromUrl, paid: false }
  }

  const orderCode = flowData.commerceOrder || orderFromUrl
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
    await resend.emails.send({
      from: 'Balladares Motors <hola@balladares-motors.cl>',
      to: order.email,
      subject: `Tus tickets ${order.order_code}`,
      html: getHtml(order.order_code, tickets, order.email, qty)
    }).catch(e=>console.error('RESEND', e))

    return { orderCode, paid: true, tickets, email: order.email }
  } catch(e){ await client.query('ROLLBACK'); throw e }
  finally { client.release() }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rawToken = searchParams.get('token') || ''
  const orderFromUrl = searchParams.get('order') || ''
  if(!rawToken &&!orderFromUrl) return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker`, 303)
  const result = await processOrder(rawToken, orderFromUrl)
  if(!result.paid){ return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}&pending=1`, 303) }
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/ventasticker/gracias?order=${result.orderCode}`, 303)
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const rawToken = (form.get('token') as string) || ''
  const orderFromUrl = new URL(req.url).searchParams.get('order') || ''
  return GET(new NextRequest(`${req.nextUrl.origin}${req.nextUrl.pathname}?token=${encodeURIComponent(rawToken)}&order=${orderFromUrl}`))
}