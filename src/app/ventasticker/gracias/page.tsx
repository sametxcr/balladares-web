"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function GraciasContent() {
  const searchParams = useSearchParams()
  const orden = searchParams.get('orden') || searchParams.get('order') || '';
  const token = searchParams.get('token') || '';
  const [tickets, setTickets] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

   useEffect(() => {
    if (!orden) { setLoading(false); return }
    let tries = 0
    const load = async () => {
      try {
        tries++
        const res = await fetch(`/api/tickets?order=${orden}`)
        const d = await res.json()
        if (d.tickets?.length) {
          setTickets(d.tickets)
          setLoading(false)
          clearInterval(i)
        }
        if(tries > 15) setLoading(false)
      } catch { setLoading(false) }
    }
    load()
    const i = setInterval(load, 2000)
    setTimeout(() => clearInterval(i), 30000) // 30 seg esperando webhook
    return () => clearInterval(i)
  }, [orden])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold mb-2">¡Pago Aprobado!</h1>
        <p className="text-zinc-400 text-sm mb-6">Orden: {orden || 'BM-????'}</p>
        <div className="bg-black rounded-xl p-4 mb-6 text-left">
          <p className="text-xs text-zinc-500 mb-2">TUS STICKETS ({loading? '...' : tickets.length}):</p>
          {loading? <div className="font-mono text-zinc-500">Generando...</div> :
           tickets.length > 0? tickets.map(t => <div key={t} className="font-mono text-yellow-400 font-bold text-lg">{t}</div>) :
           <div className="font-mono text-zinc-500 text-sm">Te llegarán al correo en segundos. Recarga. Token:{token.slice(0,6)}...</div>}
        </div>
        <Link href="/ventasticker" className="block bg-white text-black font-bold py-3 rounded-xl w-full text-center">VOLVER A VENTASTICKER</Link>
      </div>
    </div>
  )
}
export default function GraciasPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">CARGANDO...</div>}><GraciasContent /></Suspense>
}