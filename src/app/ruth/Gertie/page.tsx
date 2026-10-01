import { pool } from '@/lib/db';
import TombolaClient from './TombolaClient';
import LoginTombola from './LoginTombola';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TombolaPage() {
  const cookieStore = await cookies();
  const auth = cookieStore.get('tombola_auth')?.value;
  const VALID_KEY = process.env.ADMIN_SECRET;

  // Si no está logueado, muestra el login
  if (auth!== VALID_KEY) {
    return <LoginTombola />;
  }

  // Si está logueado, carga los tickets normal
  const { rows } = await pool.query(`
    SELECT t.ticket_code, o.nombre, o.rut, o.region, o.ciudad, o.comuna, o.order_code
    FROM tickets t
    JOIN orders o ON o.id = t.order_id
    WHERE o.status ILIKE 'paid'
    ORDER BY o.id DESC
  `);

  return <TombolaClient tickets={rows} adminKey={auth} />;
}