"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/56912345678?text=Hola%20Balladares%20Motors%2C%20quiero%20cotizar";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca todas las marcas", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073" },
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);
  return (
    <main className="bg-[#0A0A0A] text-white min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-[#E10600] flex justify-between items-center px-6 py-2">
        <img src="/logo-principal.png" alt="Balladares" className="h-11 w-auto" />
        <div className="hidden md:flex gap-6 text-sm font-black">
          <a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#contacto">CONTACTO</a>
        </div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black skew-x-[-12deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="h- relative overflow-hidden mt-">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx===i? "opacity-100" : "opacity-0 pointer-events-none"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-black/60"/>
            <div className="relative h-full flex flex-col justify-center px-10 md:px-24">
              <h1 className="text-5xl md:text-7xl font-black italic">{s.title}</h1>
              <p className="mt-4 bg-white text-black px-4 py-1 font-bold w-fit skew-x-[-12deg]"><span className="block skew-x-">{s.sub}</span></p>
              <a href="#servicios" className="mt-8 w-fit bg-[#E10600] px-8 py-3 font-black skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 flex gap-2">{slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 w-10 ${idx===i?"bg-[#E10600]":"bg-white/30"}`}/>)}</div>
      </section>

      <section className="bg-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 border-y border-white/10">
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-4 text-center font-black text-sm border-r border-white/5">✓ {t}</div>)}
      </section>

      <section id="nosotros" className="px-6 md:px-24 py-16">
        <h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2>
        <p className="mt-4 text-white/70 max-w-3xl">Taller bien conocido en Concepción. Pasión por carreras en pista y circuito, atendemos gama alta y todas las marcas. Elevadores, alineación 3D, balanceo y ajuste motor completo.</p>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16">
        <h2 className="text-4xl font-black italic">SERVICIOS</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {[{n:"Repro Stage 1/2",p:"Desde $180.000"},{n:"Scanner",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Balanceo",p:"Desde $12.000"},{n:"Ajuste Motor",p:"Cotizar"},{n:"Mecánica General",p:"Cotizar"}].map(s=><div key={s.n} className="border-2 border-black p-6"><div className="font-black">{s.n}</div><div className="text-[#E10600] font-bold">{s.p}</div></div>)}
        </div>
      </section>

      <footer className="py-10 text-center text-white/50">balladares-motors.cl - Concepción</footer>

      <a href={WHATSAPP} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black z-50">W</a>
    </main>
  );
}