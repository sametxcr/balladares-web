import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
export async function POST(req: Request){
  const { key } = await req.json()
  if(key!== process.env.ADMIN_SECRET) return NextResponse.json({}, {status:401})
  const c = await cookies()
  c.set('admin_auth', key, { httpOnly:true, secure:true, sameSite:'lax', maxAge:60*60*8, path:'/' })
  // misma cookie para tombola también
  c.set('tombola_auth', key, { httpOnly:true, secure:true, sameSite:'lax', maxAge:60*60*8, path:'/' })
  return NextResponse.json({ok:true})
}