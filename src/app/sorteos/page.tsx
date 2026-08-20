"use client"
import { useState } from "react"
const YOUTUBE_ID = "XwMZ5Q70CAk"

type Pack = { id: string, nombre: string, qty: number, precio: number, tag?: string }

const PACKS: Pack[] = [
  { id: "x1", nombre: "UNIDAD 1X STICKER", qty: 1, precio: 3000 },
  { id: "x4", nombre: "PACK X4 4X STICKERS", qty: 4, precio: 10000, tag: "MAS POPULAR - MAS VENDIDO" },
]

function SwiftCard() {
  const [play, setPlay] = useState(false);
  return (
    <div className="bg-zinc-100 rounded-2xl p-4 text-center border border-black/5 flex flex-col">
      <div className="h-36 bg-white rounded-xl mb-3 overflow-hidden relative flex items-center justify-center">
        <img src={play? "/swiftupgrade.gif" : "/swiftupgrade.jpg"} alt="Swift Sport Balladares Motors" className="w-full h-full object-contain" />
      </div>
      <div className="bg-blue-900 text-white font-black text-xs py-2 rounded-full">SWIFT SPORT</div>
      <button onClick={() => setPlay(!play)} className={`relative mt-3 w-full font-black text- leading-[0.9] py-3.5 rounded-full border-2 border-black shadow-[4px_4px_0px_black] tracking-wider overflow-hidden transition-all active:translate-x- active:translate-y- active:shadow-[1px_1px_0px_black] ${!play? 'bg-[#FFD400] text-black animate-bounce' : 'bg-red-600 text-white animate-pulse'}`}>
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent skew-x-12"></div>
        <span className="relative">{!play? (<>¿REGALAMOS UNO<br/>STOCK? 🤔</>) : (<>¡NO WN!<br/>¡STAGE 2! 🔥</>)}</span>
      </button>
      <style>{`@keyframes shimmer { 100% { transform: translateX(200%) skewX(12deg); } }`}</style>
    </div>
  );
}

export default function SorteosPage() {
	const YOUTUBE_ID = "XwMZ5Q70CAk"
	const WHATSAPP = "56982637808";
    const WHATSAPP_NEUMATICO = "56982637808";
    const WHATSAPP_REPUESTO = "56982637808";
    const INSTAGRAM = "https://www.instagram.com/balladaresmotor/"; 
	
  function goCheckout(pack: Pack) {
    window.location.href = `/checkout?pack=${pack.id}&qty=1`
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="fixed top-0 w-full bg-black border-b-2 border-red-600 flex justify-between items-center pl-1 pr-4 py-2.5" style={{zIndex:50}}>
        <img src="/BB.png" alt="Balladares Motors" className="h-11 w-auto -ml-2 shrink-0" style={{objectFit:"contain", transform:"scaleX(1.44) scaleY(1.06)", transformOrigin:"left center", height:52}} />
        <div className="hidden lg:flex gap-3 text-sm font-black tracking-wider" style={{position:'absolute', left:'50%', top:'50%', transform:'translate(-50%, -50%)'}}>
          {[
            {id:"inicio", label:"INICIO", href:"/#inicio"},
            {id:"nosotros", label:"NOSOTROS", href:"/#nosotros"},
            {id:"servicios", label:"SERVICIOS", href:"/#servicios"},
            {id:"galeria", label:"GALERÍA", href:"/#galeria"},
            {id:"contacto", label:"CONTACTO", href:"/#contacto"},
            {id:"sorteos", label:"SORTEOS 🎟", href:"/sorteos", destacado:true},
          ].map(link=>(
            <a key={link.id} href={link.href} onClick={()=>{ if(link.id!== "sorteos"){ sessionStorage.setItem("bm_from_sorteos","1") } }} className={`relative px-4 py-2 border group ${link.destacado? "bg-red-600 border-red-600 text-white" : "border-white/10 hover:border-red-600 hover:bg-red-600/10"}`} style={{transform:"skewX(-12deg)"}}>
              <span className={`${link.destacado? "" : "group-hover:text-red-500"}`} style={{transform:"skewX(12deg)", display:"block"}}>{link.label}</span>
            </a>
          ))}
        </div>
      </nav>

<section className="relative bg-zinc-900 py-24 md:py-32 px-6 border-b-2 border-red-900 overflow-hidden flex flex-col items-center justify-center min-h-" style={{marginTop:58}}>

  <video
    src="/circle.mp4"
    autoPlay
    loop
    muted
    playsInline
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen object-cover"
    style={{
      width: "auto",
      height: "300%",
      transform: "translate(-50%, -50%) scale(1.0)",
      opacity: 0.80
    }}
  />

  <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/30 via-zinc-900/60 to-zinc-900 pointer-events-none" />

  <div className="relative z-10 w-full max-w-5xl flex flex-col items-center text-center">

    <h1 className="font-black italic text-5xl md:text-7xl leading-[0.9] tracking-tighter text-white">
      COMPRA TUS <br />
      <span className="text-red-600">STICKERS</span><br />
      DIGITALES
    </h1>

    <div className="mt-6 flex items-center gap-4 max-w-2xl">
  <img src="/copa_balladares_3d_FINAL.png" alt="Copa Balladares" className="w-14 h-14 md:w-20 md:h-20 object-contain drop-shadow-[0_0_20px_rgba(250,204,21,0.6)] flex-shrink-0" />
  <p className="text-lg md:text-xl font-black tracking-wide text-white/60 leading-none">
    Y GANA UNO DE LOS <br />
    <span className="text-white">INCREÍBLES PREMIOS BALLADARES</span>
  </p>
</div>

    <a
      href="#packs"
      className="mt-8 inline-block bg-red-600 hover:bg-red-700 px-12 py-4 rounded-full font-black italic text-lg text-white transition-all hover:scale-105 shadow-[0_0_40px_rgba(220,38,38,0.5)]"
    >
      COMPRAR STICKERS
    </a>

  {/* 3 BADGES PRO - BALLADARES */}
<div className="mt-12 flex flex-wrap gap-3 justify-center">
  <div className="group flex items-center gap-3 bg-zinc-900 border border-white/5 rounded-full pl-1.5 pr-5 py-1.5 hover:border-yellow-400/30 transition-all">
    <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-black text-">✓</div>
    <span className="font-black italic text- tracking-widest text-white">COMPRA <span className="text-zinc-500 not-italic font-bold">100% SEGURA</span></span>
  </div>

  <div className="group flex items-center gap-3 bg-zinc-900 border border-white/5 rounded-full pl-1.5 pr-5 py-1.5 hover:border-yellow-400/30 transition-all">
    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
    </div>
    <span className="font-black italic text- tracking-widest text-white">TICKETS <span className="text-zinc-500 not-italic font-bold">AL INSTANTE</span></span>
  </div>

  <div className="group flex items-center gap-3 bg-zinc-900 border border-white/5 rounded-full pl-1.5 pr-5 py-1.5 hover:border-yellow-400/30 transition-all">
    <div className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>
    </div>
    <span className="font-black italic text- tracking-widest text-white">SORTEO <span className="text-zinc-500 not-italic font-bold">TRANSPARENTE</span></span>
  </div>
</div>
  </div>
</section>

    <section className="py-20 px-6 bg-[#080808] text-white relative overflow-hidden">
  {/* glow amarillo */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w- h- bg-yellow-400/20 blur- rounded-full pointer-events-none" />

  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-12">
      <span className="bg-yellow-400 text-black font-black text- tracking-[0.3em] px-5 py-2 rounded-full">BALLADARES VAULT • AÑO 2026</span>
      <h2 className="font-black italic text-5xl md:text-7xl mt-6 tracking-tighter leading-[0.85]">
        PREMIOS QUE SE <span className="text-yellow-400">DESBLOQUEAN</span>
      </h2>
      <p className="text-zinc-400 text-xs md:text-sm mt-4 font-bold tracking-wide max-w-3xl mx-auto">
        TODOS LOS PREMIOS PARA USTEDES!!! - TODOS NUESTROS CODIGOS EMPIEZAN CON <span className="text-white font-mono">BMxxxxxxx</span>
      </p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
      {/* PREMIO 1 - COPA 350Z */}
      <div className="lg:col-span-6 relative bg-gradient-to-b from-zinc-900 to-black rounded- border border-yellow-400/40 p-[1.5px]">
        <div className="bg-black rounded- overflow-hidden h-full flex flex-col">
          <div className="p-6 flex justify-between items-center bg-black">
            <span className="bg-yellow-400 text-black font-black text-xs px-4 py-1.5 rounded-full">🔥 PREMIO ACTIVO</span>
            <span className="font-mono text- text-zinc-500">VAULT #01 / 04</span>
          </div>
          <div className="relative flex-1 bg-gradient-to-b from-[#111] to-black flex items-center justify-center py-10 min-h-">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(250,204,21,0.28),_transparent_65%)]" />
            <img
              src="/copa_350z_negro_goldbase.png"
              alt="Copa 350Z Negro Gold"
              className="relative z-10 w-[90%] max-w- object-contain drop-shadow-[0_0_60px_rgba(250,204,21,0.7)] hover:scale-105 transition-transform duration-700"
            />
          </div>
          <div className="p-7 bg-zinc-950 border-t border-white/5">
            <h3 className="font-black italic text-3xl leading-none">COPA 350Z NEGRO GOLD BASE</h3>
            <p className="text-yellow-400 font-black text-xs tracking-[0.2em] mt-2">EDICIÓN BALLADARES MOTORS</p>
            <p className="text-zinc-400 text-sm mt-3">El primer sorteo oficial 1/1. Base gold premium.(imagen de referencia)</p>
            <div className="mt-5 flex gap-2">
              <div className="flex-1 bg-white text-black font-black text-center text-xs py-3 rounded-full">INCLUIDO EN TU COMPRA</div>
              <div className="bg-zinc-900 border border-white/10 text-white font-mono text-xs px-4 py-3 rounded-full">BM•TICKET</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 PRÓXIMOS SORTEOS */}
      <div className="lg:col-span-6 grid grid-cols-1 gap-5">
        {[
          { id: 2, cat: "DRIFT /JDM /RACING/4X4", name: "VAULT #02 • AUTO SORPRESA" },
          { id: 3, cat: "DRIFT /JDM /RACING/4X4", name: "VAULT #03 • AUTO SORPRESA" },
          { id: 4, cat: "DRIFT /JDM /RACING/4X4", name: "VAULT #04 • AUTO SORPRESA" },
        ].map((sorteo) => (
          <div key={sorteo.id} className="bg-[#141414] border border-white/5 rounded- p-6 flex items-center gap-6 hover:border-white/10 transition-colors">
            <div className="w-28 h-28 rounded-2xl bg-black border border-dashed border-white/10 flex items-center justify-center flex-shrink-0">
              <div className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">🔒</div>
                <p className="font-black text- mt-2 tracking-widest text-zinc-500">VAULT 0{sorteo.id}</p>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-white/10 text-white/70 text- font-black px-3 py-1 rounded-full">PRÓXIMAMENTE</span>
                <span className="text- font-black tracking-widest text-yellow-400">{sorteo.cat}</span>
              </div>
              <h4 className="font-black italic text-xl mt-2 leading-none">{sorteo.name}</h4>
              <p className="text-zinc-400 text-sm mt-2 leading-snug">Próximos sorteos, autos distintos y diferentes disciplinas.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      <section id="packs" className="py-16 px-6">
        <h2 className="font-black italic text-5xl text-center">COMPRA TUS STICKERS HOY</h2>
        <p className="text-center text-white/60 font-bold text-sm mt-2">El link de descarga de tus stickers te llegará por correo posterior a realizada la compra.</p>
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-10">
          {PACKS.map(p=>(
            <div key={p.id} className="bg-zinc-900 border-2 border-white/10 rounded- p-6 relative overflow-hidden">
              {p.tag && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-900 border border-white/20 px-4 py-1 rounded-full text-xs font-black">⭐ {p.tag}</div>}
              <h3 className="font-black italic text-3xl mt-8">{p.nombre.includes("X4")? "PACK X4" : "UNIDAD"}<br/><span className="text-red-600 text-5xl">{p.qty}X STICKERS</span></h3>
              <div className="text-5xl font-black italic mt-4">${p.precio.toLocaleString("es-CL")}</div>
              <button onClick={()=>goCheckout(p)} className="w-full mt-6 bg-red-600 hover:bg-red-700 py-4 rounded-full font-black">COMPRAR {p.qty === 1? "STICKER" : "STICKERS"}</button>
            </div>
          ))}
        </div>
      </section>
	  <div className="fixed bottom-6 right-6 flex flex-row gap-4 items-center" style={{ zIndex: 9999 }}>
  <a href={INSTAGRAM} target="_blank" className="w- h- bg-white rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" className="w-11 h-11 object-contain" alt="IG" />
  </a>
  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="w- h- bg-[#25D366] rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-12 h-12 object-contain" alt="WA" />
  </a>
</div>
    </div>
  )
}