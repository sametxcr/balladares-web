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
      } catch {
        if(tries > 15) setLoading(false)
      }
    }
    load()
    const i = setInterval(load, 2000)
    setTimeout(() => { clearInterval(i); setLoading(false) }, 30000)
    return () => clearInterval(i)
  }, [orden])

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-start md:justify-center p-0 md:p-8">
      <div className="w-full max-w- bg-black md:bg-zinc-900 md:border md:border-zinc-800 md:rounded- p-6 md:p-8 text-center min-h-screen md:min-h-0">

        {/* LOGO BB.png */}
        <div className="flex justify-center mb-8 mt-4">
          <img src="/BB.png" alt="Balladares Motors" className="h-14 w-auto object-contain invert-0" />
        </div>

        <div className="w-16 h-16 bg-[#FFD600] rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-3xl">✅</span>
        </div>

        <h1 className="text-2xl font-black tracking-tighter mb-1 text-white">¡PAGO APROBADO!</h1>
        <p className="text-zinc-400 text-xs mb-6 font-mono">ORDEN: {orden || 'BM-????'}</p>

        <div className="bg-zinc-900 md:bg-black rounded-2xl p-4 mb-4 text-left border border-zinc-800">
          <p className="text- text-zinc-500 mb-3 tracking-widest font-bold">TUS CÓDIGOS ({loading? '...' : tickets.length}):</p>
          {loading? (
            <div className="font-mono text-zinc-500 animate-pulse">Generando...</div>
          ) : tickets.length > 0? (
            <div className="space-y-2">
              {tickets.map(t => (
                <div key={t} className="bg-zinc-800 md:bg-zinc-900 border border-yellow-500/20 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="font-mono text-yellow-400 font-bold text-lg tracking-wider">{t}</span>
                  <span className="text- bg-[#FFD600] text-black font-bold px-2 py-1 rounded-md">STICKER</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-zinc-500 text-sm">Te llegarán al correo. Recarga. Token:{token.slice(0,6)}...</div>
          )}
        </div>

        <div className="bg-[#FFD600] text-black rounded-xl p-3 mb-6 flex gap-3 text-left">
          <span className="text-xl">📸</span>
          <div>
            <p className="font-black text- leading-none mb-1">¡TÓMALE UNA FOTO POR SI ACASO!</p>
            <p className="text- leading-tight">Guarda esta pantalla. También te los enviamos al correo pero saca pantallazo ahora.</p>
          </div>
        </div>

        <Link href="/ventasticker" className="block bg-white text-black font-black py-4 rounded-xl w-full tracking-tighter">
          VOLVER A VENTASTICKER
        </Link>
        <p className="text- text-zinc-600 mt-4">¿Dudas? Escríbenos a @balladares.motors</p>
      </div>
    </div>
  )
}

export default function GraciasPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">CARGANDO...</div>}><GraciasContent /></Suspense>
}