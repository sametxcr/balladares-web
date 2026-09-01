import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const { key } = await req.json()
  if (key!== process.env.ADMIN_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const cookieStore = await cookies()
  cookieStore.set('tombola_auth', key, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 6,
    path: '/'
  })
  return NextResponse.json({ ok: true })
}