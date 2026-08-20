import Link from 'next/link';

export default function ExitoPage({ searchParams }: { searchParams: { orden?: string, tickets?: string, monto?: string } }) {
  const orden = searchParams.orden || 'BM-????';
  const ticketsParam = searchParams.tickets || '';
  const tickets = ticketsParam ? ticketsParam.split(',').filter(Boolean) : [`${orden}-1`];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">¡Pago Aprobado!</h1>
        <p className="text-zinc-400 text-sm mb-6">Orden: {orden} {searchParams.monto ? `- $${searchParams.monto}` : ''}</p>
        
        <div className="bg-black rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-zinc-500 mb-2">TUS TICKETS ({tickets.length}):</p>
          <div className="space-y-1 max-h-40 overflow-auto">
            {tickets.map(t => (
              <div key={t} className="font-mono text-yellow-400 font-bold text-lg">{t}</div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-500 mb-6">Te enviamos los tickets a tu correo. Guarda este código, con eso participas del sorteo.</p>
        
        <Link href="/sorteos" className="block bg-white text-black font-bold py-3 rounded-xl w-full text-center">
          VOLVER A SORTEOS
        </Link>
      </div>
    </div>
  )
}