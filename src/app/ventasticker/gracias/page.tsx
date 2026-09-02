"use client"
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Image from 'next/image';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded- p-6 md:p-8 max-w- w-full text-center shadow-2xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-2xl p-3">
             <img src="/logo-balladares.png" alt="Balladares Motors" className="h-10 w-auto object-contain" />
             {/* Si no tienes logo usa texto: <span className="text-black font-black tracking-tighter text-xl">BALLADARES MOTORS</span> */}
          </div>
        </div>

        <div className="w-16 h-16 bg-[#FFD600] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
        <h1 className="text- font-black tracking-tighter mb-1">¡PAGO APROBADO!</h1>
        <p className="text-zinc-400 text- mb-6 font-mono">ORDEN: {orden || 'BM-????'}</p>

        <div className="bg-black rounded-2xl p-4 mb-4 text-left border border-zinc-800">
          <p className="text- text-zinc-500 mb-3 tracking-widest font-bold">TUS CÓDIGOS ({loading? '...' : tickets.length}):</p>
          {loading? (
            <div className="font-mono text-zinc-500 animate-pulse py-2">Generando tus códigos...</div>
          ) : tickets.length > 0? (
            <div className="space-y-2">
              {tickets.map(t => (
                <div key={t} className="bg-zinc-900 border border-[#FFD600]/30 rounded-xl px-4 py-3 flex justify-between items-center">
                  <span className="font-mono text-[#FFD600] font-black text-xl tracking-widest">{t}</span>
                  <span className="text- bg-[#FFD600] text-black font-bold px-2 py-1 rounded-md">STICKER</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="font-mono text-zinc-500 text-sm">Te llegarán al correo en segundos. Recarga la página. Token:{token.slice(0,6)}...</div>
          )}
        </div>

        {/* Aviso Foto */}
        <div className="bg-[#FFD600] text-black rounded-xl p-3 mb-6 flex gap-3 text-left items-start">
          <div className="text-xl">📸</div>
          <div>
            <p className="font-black text- leading-tight">¡TÓMALE UNA FOTO POR SI ACASO!</p>
            <p className="text- leading-tight font-medium opacity-80">Guarda esta pantalla. También te los enviamos al correo pero saca pantallazo ahora.</p>
          </div>
        </div>

        <Link href="/ventasticker" className="block bg-white text-black font-black py-4 rounded-xl w-full text-center tracking-tighter hover:bg-zinc-200 transition">
          VOLVER A VENTASTICKER
        </Link>
        <p className="text- text-zinc-600 mt-4">¿Dudas? Escríbenos a Instagram @balladares.motors</p>
      </div>
    </div>
  )
}

export default function GraciasPage() {
  return <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center">CARGANDO...</div>}><GraciasContent /></Suspense>
}