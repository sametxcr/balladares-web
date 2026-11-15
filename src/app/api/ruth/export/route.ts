import { pool } from '@/lib/db';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function edadEstimadaPorRut(rut: string | null) {
  if (!rut) return '';
  const num = parseInt(rut.replace(/[^0-9]/g, '').slice(0, -1) || '0');
  if (!num) return '';
  if (num < 8000000) return 58;
  if (num < 12000000) return 48;
  if (num < 16000000) return 38;
  if (num < 19000000) return 30;
  if (num < 22000000) return 24;
  return 20;
}

export async function GET(req: NextRequest) {
  const auth = (await cookies()).get('admin_auth')?.value;
  if (auth !== process.env.ADMIN_SECRET) return new Response('No autorizado', { status: 401 });

  const q = req.nextUrl.searchParams.get('q') || '';
  const region = req.nextUrl.searchParams.get('region') || '';

  const { rows } = await pool.query(`
    SELECT o.order_code, o.nombre, o.rut, o.celular, o.email, o.qty, o.region, o.ciudad, o.comuna, o.direccion, o.created_at, o.status,
    STRING_AGG(t.ticket_code, ' ' ORDER BY t.ticket_code) as tickets
    FROM orders o LEFT JOIN tickets t ON t.order_id=o.id
    WHERE ($1='' OR o.nombre ILIKE '%'||$1||'%' OR o.rut ILIKE '%'||$1||'%' OR o.email ILIKE '%'||$1||'%' OR o.celular ILIKE '%'||$1||'%' OR o.order_code ILIKE '%'||$1||'%')
    AND ($2='' OR o.region ILIKE $2)
    GROUP BY o.id ORDER BY o.created_at DESC
  `, [q, region]);

  const data = rows.map((o: any) => ({
    'CLIENTE': o.nombre || '',
    'ORDEN': o.order_code || '',
    'ESTADO': o.status || '',
    'FECHA': new Date(o.created_at).toLocaleDateString('es-CL'),
    'RUT': o.rut || '',
    'CELULAR': o.celular || '',
    'EDAD EST.': edadEstimadaPorRut(o.rut),
    'EMAIL': o.email || '',
    'REGION': o.region || '',
    'CIUDAD': o.ciudad || '',
    'COMUNA': o.comuna || '',
    'DIRECCION': o.direccion || '',
    'QTY': o.qty || '',
    'TICKETS': o.tickets || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  // Anchos de columna pa que no se vea apretado
  ws['!cols'] = [
    { wch: 28 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 14 },
    { wch: 14 }, { wch: 10 }, { wch: 28 }, { wch: 16 }, { wch: 16 },
    { wch: 16 }, { wch: 30 }, { wch: 6 }, { wch: 60 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  return new Response(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="balladares-ventas-${new Date().toISOString().slice(0,10)}.xlsx"`,
    },
  });
}