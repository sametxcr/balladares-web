import { pool } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: { searchParams: { q?: string, key?: string, page?: string } }) {
  if (searchParams.key!== process.env.ADMIN_SECRET) {
    return <div className="min-h-screen bg-black text-white grid place-items-center font-black">🔒 NO AUTORIZADO</div>
  }
  const q = (searchParams.q || '').trim();
  const page = Math.max(1, parseInt(searchParams.page || '1'));
  const LIMIT = 100;
  const OFFSET = (page - 1) * LIMIT;

  const [{ rows }, { rows: countRows }] = await Promise.all([
    pool.query(`
      SELECT o.id, o.order_code, o.nombre, o.rut, o.celular, o.email, o.qty, o.region, o.ciudad, o.comuna, o.direccion, o.created_at, o.status,
      COUNT(t.id) as total_tickets, STRING_AGG(t.ticket_code, ',' ORDER BY t.ticket_code) as tickets
      FROM orders o LEFT JOIN tickets t ON t.order_id=o.id
      WHERE $1='' OR o.nombre ILIKE '%'||$1||'%' OR o.rut ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%' OR o.celular ILIKE '%'||$1||'%' OR o.order_code ILIKE '%'||$1||'%' OR o.region ILIKE '%'||$1||'%' OR o.ciudad ILIKE '%'||$1||'%'
      GROUP BY o.id ORDER BY o.created_at DESC LIMIT $2 OFFSET $3
    `, [q, LIMIT, OFFSET]),
    pool.query(`SELECT COUNT(*) FROM orders o WHERE $1='' OR o.nombre ILIKE '%'||$1||'%' OR o.rut ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%' OR o.celular ILIKE '%'||$1||'%' OR o.order_code ILIKE '%'||$1||'%' OR o.region ILIKE '%'||$1||'%'`, [q])
  ]);

  const total = parseInt(countRows[0].count);
  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-red-600 selection:text-white">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@700&family=Inter:wght@900&display=swap');`}</style>

      {/* TOP BAR RACING */}
      <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-white to-red-600" />
      <div className="border-b border-zinc-900 bg-[#0a0a0a] sticky top-0 z-20">
        <div className="max-w- mx-auto px-4 h- flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-red-600 rounded- grid place-items-center font-black italic -skew-x-12">BM</div>
            <h1 className="font-black italic tracking-tighter text- -skew-x-6">BALLADARES<span className="text-red-600">_ADMIN</span></h1>
            <div className="hidden md:flex items-center gap-2 ml-6 text- font-mono">
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded">{total} ÓRDENES</span>
              <span className="px-2 py-1 bg-red-600 text-black font-black rounded">P{page}/{totalPages || 1}</span>
            </div>
          </div>
          <form className="flex gap-2">
            <input type="hidden" name="key" value={searchParams.key} />
            <input name="q" defaultValue={q} placeholder="RUT / NOMBRE / CEL / REGIÓN" className="w- md:w- bg-zinc-900 border border-zinc-800 rounded-full px-5 h-10 text- font-bold placeholder:text-zinc-600 focus:outline-none focus:border-red-600" />
            <button className="h-10 px-6 bg-white text-black rounded-full font-black italic text- hover:bg-zinc-200">BUSCAR</button>
          </form>
        </div>
      </div>

      {/* TABLE */}
      <div className="max-w- mx-auto p-2 md:p-4">
        <div className="bg-[#101010] border border-zinc-900 rounded- overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-140px)]">
            <table className="w-full text- font-mono border-collapse">
              <thead className="sticky top-0 z-10 bg-[#101010] border-b border-zinc-800 text- tracking-widest text-zinc-500">
                <tr>
                  <th className="text-left p-3 font-black">CLIENTE / ORDEN</th>
                  <th className="text-left p-3">RUT / CEL</th>
                  <th className="text-left p-3">CONTACTO / UBICACIÓN</th>
                  <th className="text-center p-3">QTY</th>
                  <th className="text-left p-3 w-">TICKETS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o:any)=>(
                  <tr key={o.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/70 transition group">
                    <td className="p-3">
                      <div className="font-black italic text- text-white leading-none">{o.nombre?.toUpperCase()}</div>
                      <div className="flex gap-1.5 mt-1.5">
                        <span className="px-1.5 py-0.5 bg-white text-black rounded text- font-black">{o.order_code}</span>
                        <span className={`px-1.5 py-0.5 rounded text- font-black ${o.status==='PAID' || o.status==='paid'? 'bg-[#FFD000] text-black' : 'bg-zinc-800 text-zinc-400'}`}>{o.status}</span>
                        <span className="text- text-zinc-600">{new Date(o.created_at).toLocaleDateString('es-CL')}</span>
                      </div>
                    </td>
                    <td className="p-3 leading-tight">
                      <div className="text-white font-bold">{o.rut}</div>
                      <div className="text-zinc-500">{o.celular}</div>
                    </td>
                    <td className="p-3 leading-tight max-w-">
                      <div className="truncate text-zinc-300">{o.email}</div>
                      <div className="text- text-zinc-500 truncate"><span className="text-red-500 font-black">{o.region || 'SIN REGIÓN'}</span> • {o.ciudad}{o.comuna? `/${o.comuna}`:''}</div>
                      <div className="text- text-zinc-600 truncate">{o.direccion}</div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="w-8 h-8 mx-auto grid place-items-center bg-red-600 text-black font-black rounded-full italic -skew-x-6">{o.qty}</div>
                    </td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {(o.tickets||'').split(',').slice(0,6).map((c:string)=>
                          c && <span key={c} className="px-1.5 py-0.5 bg-black border border-zinc-800 rounded text- text-zinc-300">{c.trim()}</span>
                        )}
                        {(o.tickets||'').split(',').length>6 && <span className="px-1.5 py-0.5 bg-zinc-800 rounded text-">+{ (o.tickets||'').split(',').length-6 }</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-between items-center p-3 border-t border-zinc-900 bg-black">
            <div className="text- font-mono text-zinc-600">MOSTRANDO {OFFSET+1}-{Math.min(OFFSET+LIMIT, total)} DE {total}</div>
            <div className="flex gap-2">
              {page>1 && <Link href={`/admin/tickets?key=${searchParams.key}&q=${q}&page=${page-1}`} className="px-4 h-8 grid place-items-center bg-zinc-900 border border-zinc-800 rounded-full text- font-black">← ANTERIOR</Link>}
              {page<totalPages && <Link href={`/admin/tickets?key=${searchParams.key}&q=${q}&page=${page+1}`} className="px-4 h-8 grid place-items-center bg-white text-black rounded-full text- font-black">SIGUIENTE →</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}