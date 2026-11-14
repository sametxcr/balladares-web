'use client';
import { useState, useMemo, useEffect } from 'react';

export default function Charts({ porDia, porRegion }: { porDia: any[], porRegion: any[] }) {
  const [showHistorial, setShowHistorial] = useState(false);
  const [busquedaDia, setBusquedaDia] = useState('');

  const ultimos10 = useMemo(() => [...porDia].slice(-10).reverse(), [porDia]);

  const historialFiltrado = useMemo(() => {
    const todos = [...porDia].reverse();
    if (!busquedaDia.trim()) return todos;
    return todos.filter(d => new Date(d.dia).toLocaleDateString('es-CL').includes(busquedaDia.trim()));
  }, [porDia, busquedaDia]);

  const maxDia = Math.max(...ultimos10.map(d => d.tickets), 1);
  const maxReg = Math.max(...porRegion.map(d => d.tickets), 1);
  const maxHistorial = Math.max(...porDia.map(d => d.tickets), 1);

  const totalHistorialTickets = porDia.reduce((acc, d) => acc + d.tickets, 0);
  const totalHistorialOrdenes = porDia.reduce((acc, d) => acc + d.ordenes, 0);
  const mejorDia = porDia.length ? [...porDia].sort((a, b) => b.tickets - a.tickets)[0] : null;

  // FIX: Cerrar con ESC + bloquear scroll del fondo cuando el modal está abierto
  useEffect(() => {
    if (!showHistorial) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHistorial(false);
    };
    document.addEventListener('keydown', onKey);
    // Bloquea scroll de la página de atrás
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showHistorial]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4 items-stretch">
        {/* VENTAS POR DÍA - SOLO ÚLTIMOS 10 */}
        <div className="bg-[#101010] border border-zinc-900 rounded-xl p-4 h- flex flex-col overflow-hidden">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h3 className="font-black italic text-sm">
              📈 VENTAS POR DÍA <span className="text-zinc-500 font-normal">- últimos 10 días</span>
            </h3>
            <button
              onClick={() => setShowHistorial(true)}
              className="px-3 py-1.5 bg-white text-black rounded-full text- font-black hover:bg-red-600 hover:text-white transition shrink-0"
            >
              📊 VER HISTORIAL COMPLETO →
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {ultimos10.map(d => (
              <div key={d.dia} className="flex items-center gap-2 text-">
                <span className="w- shrink-0 text-zinc-400">{new Date(d.dia).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}</span>
                <div className="flex-1 bg-zinc-900 rounded-full h-4 overflow-hidden shrink-0">
                  <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full" style={{ width: `${(d.tickets / maxDia) * 100}%` }} />
                </div>
                <span className="w- text-right font-black shrink-0">{d.tickets} tkts</span>
                <span className="w- text-right text-zinc-500 shrink-0">{d.ordenes} ord.</span>
              </div>
            ))}
            {ultimos10.length === 0 && <p className="text-zinc-600">Sin ventas</p>}
          </div>
          <p className="text- text-zinc-600 mt-2 shrink-0">Mostrando 10 de {porDia.length} días con ventas.</p>
        </div>

        {/* DE DÓNDE COMPRAN MÁS */}
        <div className="bg-[#101010] border border-zinc-900 rounded-xl p-4 h- flex flex-col overflow-hidden">
          <h3 className="font-black italic text-sm mb-3 shrink-0">
            🗺️ ¿DE DÓNDE COMPRAN MÁS? <span className="text-zinc-500 font-normal">- por región</span>
          </h3>
          <div className="flex-1 overflow-y-auto pr-1 space-y-1.5">
            {porRegion.map((d, i) => (
              <div key={d.region} className="flex items-center gap-2 text-">
                <span className="w- font-black text-red-500 shrink-0">#{i + 1}</span>
                <span className="w- shrink-0 truncate font-bold">{d.region}</span>
                <div className="flex-1 bg-zinc-900 rounded-full h-4 overflow-hidden"><div className="bg-white h-full rounded-full" style={{ width: `${(d.tickets / maxReg) * 100}%` }} /></div>
                <span className="w- text-right font-black shrink-0">{d.tickets} tkts</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL FLOTANTE - CORREGIDO */}
      {showHistorial && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
          onClick={() => setShowHistorial(false)}
        >
          <div
            className="relative bg-[#101010] border border-zinc-800 rounded-2xl w-full max-w- max-h- flex flex-col overflow-hidden shadow-2xl my-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header FIJO - siempre visible */}
            <div className="flex items-start justify-between gap-3 p-4 border-b border-zinc-800 shrink-0 bg-[#101010] sticky top-0 z-10">
              <div className="min-w-0">
                <h3 className="font-black italic text-base sm:text-lg leading-tight">📈 HISTORIAL COMPLETO DE VENTAS</h3>
                <p className="text-zinc-500 text-xs">Desde el primer día hasta hoy • {porDia.length} días con ventas • ESC para cerrar</p>
              </div>
              {/* BOTÓN X GRANDE Y SIEMPRE VISIBLE */}
              <button
                onClick={() => setShowHistorial(false)}
                className="w-10 h-10 shrink-0 grid place-items-center bg-red-600 hover:bg-red-500 text-white rounded-full text-xl font-black transition leading-none"
                aria-label="Cerrar historial"
              >
                ×
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-2 px-4 pt-4 shrink-0 flex-wrap">
              <span className="px-3 py-1.5 bg-white text-black rounded-full text-xs font-black">TOTAL: {totalHistorialTickets} TICKETS</span>
              <span className="px-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-bold">{totalHistorialOrdenes} ÓRDENES</span>
              {mejorDia && (
                <span className="px-3 py-1.5 bg-red-600 rounded-full text-xs font-black">
                  🔥 MEJOR DÍA: {new Date(mejorDia.dia).toLocaleDateString('es-CL')} • {mejorDia.tickets} TKTS
                </span>
              )}
            </div>

            {/* Buscador */}
            <div className="px-4 pt-3 pb-2 shrink-0">
              <input
                value={busquedaDia}
                onChange={e => setBusquedaDia(e.target.value)}
                placeholder="Buscar por fecha ej: 14-11-2026..."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-4 h-10 text-xs font-bold placeholder:text-zinc-600 focus:outline-none focus:border-red-600"
              />
            </div>

            {/* Lista con scroll INTERNO - esto era lo que fallaba */}
            <div className="flex-1 overflow-y-auto px-4 pb-3 pt-1 space-y-1.5 min-h-0">
              {historialFiltrado.map(d => (
                <div key={d.dia} className="flex items-center gap-3 text-xs bg-black/40 border border-zinc-900 rounded-lg px-3 py-2 hover:border-zinc-700">
                  <span className="w- shrink-0 font-bold">{new Date(d.dia).toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                  <div className="flex-1 bg-zinc-900 rounded-full h-5 overflow-hidden min-w-0">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 h-full rounded-full" style={{ width: `${(d.tickets / maxHistorial) * 100}%` }} />
                  </div>
                  <span className="w- text-right font-black shrink-0">{d.tickets} tkts</span>
                  <span className="w- text-right text-zinc-500 shrink-0 hidden sm:block">{d.ordenes} ord.</span>
                </div>
              ))}
              {historialFiltrado.length === 0 && <p className="text-center text-zinc-600 py-10">Sin resultados para "{busquedaDia}"</p>}
            </div>

            {/* Footer FIJO con botón cerrar */}
            <div className="p-3 border-t border-zinc-800 text-center shrink-0 bg-[#101010]">
              <button onClick={() => setShowHistorial(false)} className="px-8 h-10 bg-white text-black rounded-full text-xs font-black hover:bg-zinc-200">CERRAR ✕</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}