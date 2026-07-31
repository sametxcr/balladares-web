"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "56900000000";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "/hero/repro.jpg", pos: "50% 30%", scale: 0.7 },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca para todas las marcas", img: "/hero/scanner.jpg", pos: "50% 50%", scale: 0.9 },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "/hero/pista.jpg", pos: "50% 30%", scale: 0.7 },
];

const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000" },
  { n: "Scanner Multimarca", p: "Desde $25.000" },
  { n: "Alineación 3D", p: "Desde $18.000" },
  { n: "Balanceo", p: "Desde $12.000" },
  { n: "Ajuste Motor", p: "Cotizar" },
  { n: "Mecánica General", p: "Cotizar" },
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),4500); return()=>clearInterval(t) },[]);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black border-b-2 border-red-600 flex justify-between items-center px-6 py-3">
        <div className="font-black text-xl italic tracking-wider flex items-center">
          <span>BALLADARES</span>
          <span className="bg-red-600 px-3 ml-2" style={{transform:"skewX(-12deg)", display:"inline-block"}}>
            <span style={{transform:"skewX(12deg)", display:"inline-block"}}>MOTORS</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold">
          <a href="#inicio" className="hover:text-red-500">INICIO</a>
          <a href="#nosotros" className="hover:text-red-500">NOSOTROS</a>
          <a href="#servicios" className="hover:text-red-500">SERVICIOS</a>
          <a href="#contacto" className="hover:text-red-500">CONTACTO</a>
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-red-600 px-6 py-2 font-black" style={{transform:"skewX(-12deg)"}}>
          <span style={{transform:"skewX(12deg)", display:"block"}}>COTIZAR</span>
        </a>
      </nav>

      <section id="inicio" className="h-[85vh] relative overflow-hidden mt-[56px] bg-zinc-900">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`}>
            <img
  src={s.img}
  alt={s.title}
  className="absolute inset-0 w-full h-full"
  style={{objectFit:"cover", objectPosition: s.pos}}
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full flex flex-col justify-center px-6 md:px-24">
              <h1 className="text-5xl md:text-8xl font-black italic leading-none max-w-4xl">{s.title}</h1>
              <p className="mt-6 text-lg bg-white text-black inline-block px-5 py-2 font-bold w-fit" style={{transform:"skewX(-12deg)"}}>
                <span style={{transform:"skewX(12deg)", display:"block"}}>{s.sub}</span>
              </p>
              <a href="#servicios" className="mt-8 w-fit bg-red-600 px-8 py-3 font-black hover:bg-white hover:text-black transition" style={{transform:"skewX(-12deg)"}}>
                <span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span>
              </a>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-10 flex gap-2">
          {slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 w-12 transition-all ${idx===i?"bg-red-600":"bg-white/30"}`} />)}
        </div>
      </section>

      <section className="bg-[#111] border-y border-white/10 grid grid-cols-2 md:grid-cols-4">
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-5 text-center font-black text-sm border-r border-white/5 last:border-0"><span className="text-red-600">✓</span> {t}</div>)}
      </section>

      <section id="nosotros" className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-red-600">HISTORIA</span></h2>
          <p className="mt-6 text-white/60 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo.</p>
          <ul className="mt-8 space-y-3">{["Scanner multimarca","Elevadores profesionales","Alineación y balanceo","Repro Stage 1 y 2"].map(x=><li key={x} className="flex gap-3 font-bold"><span className="text-red-600">■</span>{x}</li>)}</ul>
        </div>
        <div className="bg-zinc-900 p-2 border border-white/10" style={{transform:"skewX(-6deg)"}}>
          <div style={{transform:"skewX(6deg)"}}>
            <img src="/hero/entrada.jpg" alt="taller" className="h-[400px] w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-20">
        <h2 className="text-5xl font-black italic">SERVICIOS</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {servicios.map(s=><div key={s.n} className="border-2 border-black p-6 hover:bg-black hover:text-white transition group">
            <div className="font-black text-xl">{s.n}</div>
            <div className="mt-2 text-red-600 font-bold group-hover:text-white">{s.p}</div>
            <a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" className="mt-5 inline-block bg-red-600 text-white px-5 py-2 text-sm font-black">COTIZAR</a>
          </div>)}
        </div>
      </section>

      <footer id="contacto" className="bg-black border-t-2 border-red-600 py-10 text-center text-white/50 text-sm">balladares-motors.cl - Concepción, Chile - 2026</footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-xl hover:scale-110 transition">W</a>
    </main>
  );
}

