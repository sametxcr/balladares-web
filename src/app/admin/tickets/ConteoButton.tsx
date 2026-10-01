"use client";
import { useState } from "react";

export default function ConteoButton({ paidOrders, paidTickets, totalMoney }: {
  paidOrders: number,
  paidTickets: number,
  totalMoney: number
}){
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={()=>setOpen(true)} className="h-8 px-5 bg-white text-black rounded-full font-black text- tracking-widest hover:bg-yellow-400 transition border border-black">
        CONTEO
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999] grid place-items-center p-4" onClick={()=>setOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="bg-[#101010] border border-zinc-800 rounded-2xl p-6 w-full max-w- shadow-[8px_8px_0px_#E10600]">
            <h2 className="font-black italic text-xl tracking-tight">CONTEO BALLADARES</h2>
            <p className="text- text-zinc-500 mt-1">Solo órdenes PAID</p>

            <div className="mt-5 grid gap-3 text-">
              <div className="flex justify-between bg-black border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500">ÓRDENES PAGADAS</span>
                <span className="font-black text-white">{paidOrders}</span>
              </div>
              <div className="flex justify-between bg-black border border-zinc-800 rounded-xl p-3">
                <span className="text-zinc-500">TICKETS GENERADOS</span>
                <span className="font-black text-white">{paidTickets}</span>
              </div>
              <div className="flex justify-between bg-[#FFD000] text-black rounded-xl p-4 font-black text-">
                <span>TOTAL $</span>
                <span>${totalMoney.toLocaleString('es-CL')}</span>
              </div>
              <div className="text- text-zinc-600 leading-tight">
                Cálculo: Pack x1 = $3.000 = 1 ticket<br/>Pack x4 = $10.000 = 4 tickets
              </div>
            </div>

            <button onClick={()=>setOpen(false)} className="mt-5 w-full h-10 bg-white text-black rounded-full font-black text-xs">CERRAR</button>
          </div>
        </div>
      )}
    </>
  )
}