import { pool } from '@/lib/db';
import Link from 'next/link';
import { cookies } from 'next/headers';
import LoginAdmin from './LoginAdmin';
import ConteoButton from './ConteoButton';
import AdminSearch from './AdminSearch';
import RegionFilter from './RegionFilter';
import TicketsCell from './TicketsCell';
import ExportButton from './ExportButton';
import Charts from './Charts';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// --- Edad ESTIMADA por RUT (referencial, no exacta) ---
function edadEstimadaPorRut(rut: string | null) {
  if (!rut) return null;
  const num = parseInt(rut.replace(/[^0-9]/g, '').slice(0, -1) || '0');
  if (!num) return null;
  if (num < 8000000) return 58;
  if (num < 12000000) return 48;
  if (num < 16000000) return 38;
  if (num < 19000000) return 30;
  if (num < 22000000) return 24;
  return 20;
}

function formatUbicacion(region: string, ciudad: string, comuna: string) {
  const r = (region || '').trim();
  const c = (ciudad || '').trim();
  const co = (comuna || '').trim();
  // Evita "Quillón / Quillón" o "Maipú / Maipú"
  const ciudadComuna = c && co && c.toLowerCase() !== co.toLowerCase() ? `${c} / ${co}` : (c || co);
  return { region: r || 'SIN REGIÓN', ciudadComuna };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string, page?: string, region?: string }> }) {
  const cookieStore = await cookies();
  const auth = cookieStore.get('admin_auth')?.value;
  if (auth !== process.env.ADMIN_SECRET) return <LoginAdmin />;

  const params = await searchParams;
  const q = (params.q || '').trim();
  const regionFilter = (params.region || '').trim();
  const page = Math.max(1, parseInt(params.page || '1'));
  const LIMIT = 100;
  const OFFSET = (page - 1) * LIMIT;

  // WHERE principal: $1=q, $2=LIMIT, $3=OFFSET, $4=region
  const whereMain = `WHERE ($1='' OR o.nombre ILIKE '%'||$1||'%' OR o.rut ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%' OR o.celular ILIKE '%'||$1||'%' OR o.order_code ILIKE '%'||$1||'%')
    AND ($4='' OR o.region ILIKE $4)`;

  // WHERE count: $1=q, $2=region - AQUÍ ESTABA EL ERROR ANTES
  const whereCount = `WHERE ($1='' OR o.nombre ILIKE '%'||$1||'%' OR o.rut ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%' OR o.celular ILIKE '%'||$1||'%' OR o.order_code ILIKE '%'||$1||'%')
    AND ($2='' OR o.region ILIKE $2)`;

  const [{ rows }, { rows: countRows }, { rows: ticketRows }, { rows: statsRows }, { rows: regiones }, { rows: porDia }, { rows: porRegion }] = await Promise.all([
    pool.query(`
      SELECT o.id, o.order_code, o.nombre, o.rut, o.celular, o.email, o.qty, o.region, o.ciudad, o.comuna, o.direccion, o.created_at, o.status,
      COUNT(t.id) as total_tickets, STRING_AGG(t.ticket_code, ',' ORDER BY t.ticket_code) as tickets
      FROM orders o LEFT JOIN tickets t ON t.order_id=o.id
      ${whereMain}
      GROUP BY o.id ORDER BY o.created_at DESC LIMIT $2 OFFSET $3
    `, [q, LIMIT, OFFSET, regionFilter]),

    pool.query(`SELECT COUNT(*) FROM orders o ${whereCount}`, [q, regionFilter]),

    pool.query(`SELECT COUNT(*) as total_tickets FROM tickets`),

    pool.query(`
      SELECT COUNT(*)::int as paid_orders, COALESCE(SUM(o.qty),0)::int as paid_tickets,
      COALESCE(SUM(CASE WHEN o.pack_id ILIKE '%4%' THEN (o.qty::float / 4 * 10000) ELSE o.qty::float * 3000 END),0)::int as total_money
      FROM orders o WHERE LOWER(o.status) = 'paid'
    `),

    pool.query(`SELECT DISTINCT region FROM orders WHERE region IS NOT NULL AND region <> '' ORDER BY region ASC`),

    pool.query(`
      SELECT DATE(created_at) as dia, COUNT(*)::int as ordenes, COALESCE(SUM(qty),0)::int as tickets
      FROM orders WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at) ORDER BY dia ASC
    `),

    pool.query(`
      SELECT COALESCE(NULLIF(region,''),'SIN REGIÓN') as region, COUNT(*)::int as ordenes, COALESCE(SUM(qty),0)::int as tickets
      FROM orders GROUP BY region ORDER BY tickets DESC LIMIT 10
    `),
  ]);

  const total = parseInt(countRows[0].count);
  const totalPages = Math.ceil(total / LIMIT);
  const totalTickets = parseInt(ticketRows[0]?.total_tickets || '0');
  const stats = statsRows[0];

  // Edad promedio estimada
  const edades = rows.map(o => edadEstimadaPorRut(o.rut)).filter(Boolean) as number[];
  const edadPromedio = edades.length ? Math.round(edades.reduce((a,b)=>a+b,0)/edades.length) : null;

  const buildUrl = (p: number) => `/ruth/Alexandra?q=${encodeURIComponent(q)}&region=${encodeURIComponent(regionFilter)}&page=${p}`;

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      <div className="h-1 w-full bg-gradient-to-r from-red-600 via-white to-red-600" />
      <div className="border-b border-zinc-900 bg-[#0a0a0a] sticky top-0 z-20">
        <div className="max-w- mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/" className="flex items-center gap-3">
              <img src="/BB.png" alt="Balladares" className="h-9 w-auto object-contain" />
              <h1 className="font-black italic tracking-tighter text-lg -skew-x-6 hidden sm:block">BALLADARES<span className="text-red-600">_ADMIN</span></h1>
            </Link>
            <Link href={`/ruth/Gertie`} className="ml-2 h-9 px-5 bg-[#E10600] hover:bg-red-700 text-white rounded-full font-black italic text-xs tracking-widest grid place-items-center -skew-x-12">
              <span className="skew-x-12">🎰 TÓMBOLA</span>
            </Link>
            <span className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 rounded-full font-bold text-xs">{total} ÓRDENES</span>
            <span className="px-2.5 py-1 bg-red-600 text-black font-black rounded-full text-xs">P{page}/{totalPages || 1}</span>
          </div>

          <div className="flex gap-2 items-center">
  <ExportButton q={q} region={regionFilter} />
  <RegionFilter regiones={regiones.map(r=>r.region)} current={regionFilter} q={q} />
            <AdminSearch defaultValue={q} region={regionFilter} />
          </div>
        </div>
      </div>

      <div className="max-w- mx-auto p-2 md:p-4 space-y-4">
        <div className="flex flex-wrap gap-2 items-center text-xs">
          <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-full">BALLADARES MOTORS © <span className="text-white font-black">{totalTickets} tickets en BD</span></div>
          <div className="bg-yellow-400 text-black px-4 py-2 rounded-full font-black">EDAD PROMEDIO ESTIMADA: {edadPromedio ?? '--'} AÑOS *</div>
          <ConteoButton paidOrders={stats.paid_orders} paidTickets={stats.paid_tickets} totalMoney={stats.total_money} />
          <span className="text-zinc-600 text-">* Estimada por rango de RUT, no es fecha de nacimiento real.</span>
        </div>

        <Charts porDia={porDia} porRegion={porRegion} />

        <div className="bg-[#101010] border border-zinc-900 rounded-xl overflow-hidden">
          <div className="overflow-auto max-h-[calc(100vh-140px)]">
            <table className="w-full text-xs border-collapse">
              <thead className="sticky top-0 z-10 bg-[#101010] border-b border-zinc-800 tracking-[0.15em] text-zinc-500">
                <tr>
                  <th className="text-left p-3 font-black">CLIENTE / ORDEN</th>
                  <th className="text-left p-3">RUT / CEL</th>
                  <th className="text-left p-3">CONTACTO / UBICACIÓN</th>
                  <th className="text-center p-3">QTY</th>
                  <th className="text-left p-3">TICKETS</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o:any)=>{
                  const ubi = formatUbicacion(o.region, o.ciudad, o.comuna);
                  const tickets = (o.tickets||'').split(',').filter(Boolean);
                  return (
                  <tr key={o.id} className="border-b border-zinc-900/60 hover:bg-zinc-900/70">
                    <td className="p-3">
                      <div className="font-black italic text-sm text-white">{o.nombre?.toUpperCase()}</div>
                      <div className="flex gap-1.5 mt-1.5 items-center flex-wrap">
                        <span className="px-2 py-0.5 bg-white text-black rounded-full font-black">{o.order_code}</span>
                        <span className={`px-2 py-0.5 rounded-full font-black ${o.status?.toLowerCase()==='paid'?'bg-[#FFD000] text-black':'bg-zinc-800 text-zinc-400'}`}>{o.status}</span>
                        <span className="text-zinc-600">{new Date(o.created_at).toLocaleDateString('es-CL')}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-white font-bold">{o.rut}</div>
                      <div className="text-zinc-500">{o.celular}</div>
                      <div className="text-zinc-600 text-">Edad est: {edadEstimadaPorRut(o.rut) ?? '--'}</div>
                    </td>
                    <td className="p-3 max-w-">
                      <div className="truncate text-zinc-300 max-w-" title={o.email}>{o.email}</div>
                      <div className="truncate max-w-"><span className="text-red-500 font-black">{ubi.region}</span><span className="text-zinc-500"> • {ubi.ciudadComuna}</span></div>
                      <div className="text-zinc-600 truncate max-w-" title={o.direccion}>{o.direccion}</div>
                    </td>
                    <td className="p-3 text-center"><div className="w-8 h-8 mx-auto grid place-items-center bg-red-600 font-black rounded-full italic -skew-x-6">{o.qty}</div></td>
                    <td className="p-2"><TicketsCell tickets={tickets} /></td>
                  </tr>
                  )
                })}
              </tbody>
            </table>
            {rows.length===0 && <div className="py-20 text-center text-zinc-600 text-sm">Sin resultados</div>}
          </div>
          <div className="flex justify-between items-center p-3 border-t border-zinc-900 bg-black">
            <div className="text-zinc-600">MOSTRANDO {total===0?0:OFFSET+1}-{Math.min(OFFSET+LIMIT, total)} DE {total}</div>
            <div className="flex gap-2">
              {page>1 && <Link href={buildUrl(page-1)} className="px-4 h-8 grid place-items-center bg-zinc-900 border border-zinc-800 rounded-full font-black hover:bg-zinc-800">← ANTERIOR</Link>}
              {page<totalPages && <Link href={buildUrl(page+1)} className="px-5 h-8 grid place-items-center bg-white text-black rounded-full font-black hover:bg-zinc-200">SIGUIENTE →</Link>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}