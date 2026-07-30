"use client";
import { useState, useEffect } from "react";
const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca para todas las marcas", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073" },
];
export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);
  return (
    <main>
      <nav className="fixed top-0 w-full z-50 bg-black/90 border-b border-racing flex justify-between items-center px-6 py-3">
        <div className="font-black text-xl italic tracking-wider"><span className="text-white">BALLADARES</span> <span className="bg-racing px-2 skew-racing inline-block"><span className="unskew inline-block">MOTORS</span></span></div>
        <div className="hidden md:flex gap-6 text-sm font-bold"><a>INICIO</a><a>NOSOTROS</a><a>SERVICIOS</a><a>CONTACTO</a></div>
        <a href="https://wa.me/56900000000" className="bg-racing px-5 py-2 font-black skew-racing"><span className="unskew block">COTIZAR</span></a>
      </nav>
      <section className="h-[85vh] relative overflow-hidden mt-[56px]">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-black/60"/>
            <div className="relative h-full flex flex-col justify-center px-10 md:px-24">
              <h1 className="text-5xl md:text-8xl font-black italic leading-none max-w-4xl">{s.title}</h1>
              <p className="mt-4 text-xl bg-white text-black inline-block px-4 py-1 font-bold w-fit skew-racing"><span className="unskew block">{s.sub}</span></p>
              <button className="mt-8 w-fit bg-racing px-8 py-3 font-black skew-racing"><span className="unskew block">VER SERVICIOS →</span></button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 flex gap-2">{slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 w-10 ${idx===i?"bg-racing":"bg-white/30"}`}/>)}</div>
      </section>
      <section className="bg-dark2 border-y border-white/10 grid grid-cols-2 md:grid-cols-4">
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-6 text-center font-black text-sm border-r border-white/5 last:border-0"><span className="text-racing">✓</span> {t}</div>)}
      </section>
      <section className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-10">
        <div><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-racing">HISTORIA</span></h2><p className="mt-6 text-white/70 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo.</p><ul className="mt-6 space-y-2">{["Scanner multimarca","Elevadores profesionales","Alineación y balanceo","Repro Stage 1 y 2"].map(x=><li key={x} className="flex gap-2"><span className="text-racing">■</span>{x}</li>)}</ul></div>
        <div className="bg-dark2 p-2 skew-racing"><div className="unskew bg-[url('https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=1974')] h-80 bg-cover"/></div>
      </section>
      <section className="bg-white text-black px-6 md:px-24 py-20">
        <h2 className="text-5xl font-black italic">SERVICIOS</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[{n:"Repro Stage 1/2",p:"Desde $180.000"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Balanceo",p:"Desde $12.000"},{n:"Ajuste Motor",p:"Cotizar"},{n:"Mecánica General",p:"Cotizar"}].map(s=><div key={s.n} className="border-2 border-black p-6 hover:bg-black hover:text-white transition"><div className="font-black text-xl">{s.n}</div><div className="mt-2 text-racing font-bold">{s.p}</div><button className="mt-4 bg-racing text-white px-4 py-2 text-sm font-black">COTIZAR</button></div>)}
        </div>
      </section>
      <footer className="bg-black border-t border-racing py-10 text-center text-white/50">balladares-motors.cl - Concepción, Chile - 2026</footer>
      <a href="https://wa.me/56900000000" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-xl">W</a>
    </main>
  );
}
