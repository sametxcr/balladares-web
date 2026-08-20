"use client"
import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function CheckoutContent() {
  const sp = useSearchParams()
  const pack = sp.get('pack') || 'x1'
  const qtyParam = parseInt(sp.get('qty') || '1')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", nombre: "", rut: "", direccion: "", ciudad: "", region: "", telefono: "" })

  const total = pack === 'x1'? 3000 * qtyParam : 10000 * qtyParam
  const totalStickers = pack === 'x1'? qtyParam : qtyParam * 4

  async function pagar(e:any){
    e.preventDefault(); setLoading(true)
    const res = await fetch('/api/webpay/create',{
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ email: form.email, nombre: form.nombre, rut: form.rut, pack_id: pack, pack_qty: qtyParam, qty: totalStickers })
    })
    const data = await res.json()
    if(data.url && data.token){
      const f = document.createElement('form'); f.method='POST'; f.action=data.url
      const i = document.createElement('input'); i.type='hidden'; i.name='token_ws'; i.value=data.token
      f.appendChild(i); document.body.appendChild(f); f.submit()
    } else { alert('Error TBK: '+JSON.stringify(data)); setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="bg-black py-4 flex justify-center border-b-4 border-red-600">
        <img src="/BB.png" alt="Balladares Motors" className="h-16 object-contain" />
      </header>

      <div className="max-w-6xl mx-auto grid md:grid-cols-[1.4fr_0.6fr]">
        <form onSubmit={pagar} className="p-5 md:p-10">
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <div className="bg-black p-2 rounded-lg"><img src="/BB.png" className="h-5" /></div>
            <span className="text- md:text-xs font-black tracking-widest text-zinc-500">CHECKOUT SEGURO · CONCEPCIÓN</span>
          </div>

          <h2 className="font-black text-sm tracking-widest mb-3">CONTACTO</h2>
          <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="tu@email.com" className="w-full bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none transition mb-6 md:mb-8 text- placeholder:text-zinc-400 placeholder:font-bold" />

          <h2 className="font-black text-sm tracking-widest mb-3">DATOS DE FACTURACIÓN</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input required value={form.nombre} onChange={e=>setForm({...form,nombre:e.target.value})} placeholder="Nombre completo" className="w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400 placeholder:text- md:placeholder:text-" />
            <input value={form.rut} onChange={e=>setForm({...form,rut:e.target.value})} placeholder="RUT 12.345.678-9" className="w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400 placeholder:text- md:placeholder:text-" />
            <input required value={form.direccion} onChange={e=>setForm({...form,direccion:e.target.value})} placeholder="Dirección - Paicavi 1234" className="md:col-span-2 w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400 placeholder:text- md:placeholder:text-" />
            <input value={form.ciudad} onChange={e=>setForm({...form,ciudad:e.target.value})} placeholder="Ciudad - Concepción" className="w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400 placeholder:text- md:placeholder:text-" />
            <input value={form.region} onChange={e=>setForm({...form,region:e.target.value})} placeholder="Región - Biobío" className="w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400 placeholder:text- md:placeholder:text-" />
            <input value={form.telefono} onChange={e=>setForm({...form,telefono:e.target.value})} placeholder="Teléfono +56 9..." className="md:col-span-2 w-full min-w-0 bg-zinc-100 border border-zinc-200 focus:bg-white focus:border-black p-4 rounded-xl font-bold outline-none text- placeholder:text-zinc-400" />
          </div>

          <button disabled={loading} className="w-full mt-6 md:mt-8 bg-red-600 hover:bg-black text-white font-black text- md:text-base py-4 rounded-full tracking-wide transition-colors">
            {loading? 'CONECTANDO...' : `PAGAR $${total.toLocaleString("es-CL")} CON WEBPAY →`}
          </button>
        </form>

        <div className="bg-[#f5f5f5] p-5 md:p-10 flex flex-col order-first md:order-last">
          <div className="flex gap-3 items-start">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-black rounded-xl flex items-center justify-center p-2 shrink-0"><img src="/LB.png" className="w-full h-full object-contain" /></div>
            <div className="flex-1 min-w-0">
              <div className="font-black text- md:text-sm leading-tight">PACK {pack.toUpperCase()}<br/>BALLADARES MOTORS</div>
              <div className="text-xs text-zinc-500 mt-1">{totalStickers} stickers + {totalStickers} tickets</div>
            </div>
            <div className="font-black text-sm md:text-base shrink-0">${total.toLocaleString("es-CL")}</div>
          </div>

          <div className="mt-6 md:mt-8 pt-6 border-t border-black/10 space-y-2 text-sm">
            <div className="flex justify-between text-zinc-500"><span>Subtotal</span><span className="text-black font-bold">${total.toLocaleString("es-CL")}</span></div>
            <div className="flex justify-between font-black text-base md:text-lg pt-2"><span>Total</span><span>CLP ${total.toLocaleString("es-CL")}</span></div>
          </div>

          <div className="hidden md:flex mt-auto pt-12 flex-col items-center">
            <img src="/logo-principal.png" className="w-56 object-contain opacity-90" />
            <div className="flex items-center gap-2 mt-4">
              <div className="h- w-8 bg-red-600" />
              <span className="text- tracking-[0.3em] font-black text-zinc-400">DESDE 2015</span>
              <div className="h- w-8 bg-red-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white text-black flex items-center justify-center font-black">CARGANDO CHECKOUT...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}