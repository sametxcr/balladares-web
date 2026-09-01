export const runtime='nodejs'
export const dynamic='force-dynamic'
import { NextResponse } from 'next/server'
export async function GET(){
  return NextResponse.json({
    id:'597055555532',
    secret_len: '579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C'.length,
    secret_start: '579B532A74',
    secret_end: '36B1C',
    env_secret_exists: !!process.env.TBK_API_KEY_SECRET,
    env_secret_len: process.env.TBK_API_KEY_SECRET?.length || 0
  })
}