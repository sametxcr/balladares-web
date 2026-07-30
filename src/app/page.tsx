"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20vi%20la%20web%20y%20quiero%20cotizar%20mi%20auto%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción, Bío Bío";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca todas las marcas", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073" },
];

const gallery = ["/taller/1.jpg","/taller/2.jpg","/taller/3.jpg","/taller/4.jpg","/taller/5.jpg","/taller/6.jpg"];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);
  return (
    <main className="bg-[#0A0A0A] text-white">
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-[#E10600] flex justify-between items-center px-6 py-2">
        <div className="font-black italic text-xl"><span>Balladares</span> <span className="bg-[#E10600] px-2 skew-x-[-12deg] inline-block"><span className="block skew-x-">MOTORS</span></span></div>
        <div className="hidden md:flex gap-6 text-sm font-black"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERIA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black skew-x-[-12deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="h- relative overflow-hidden mt-">
        {slides.map((s,idx)=><div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx===i?"opacity-100":"opacity-0 pointer-events-none"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/60"/><div className="relative h-full flex flex-col justify-center px-10 md:px-24"><h1 className="text-5xl md:text-7xl font-black italic">{s.title}</h1><p className="mt-4 bg-white text-black px-4 py-1 font-bold w-fit skew-x-[-12deg]"><span className="block skew-x-">{s.sub}</span></p><p className="mt-3 text-white/80 font-bold">{ADDRESS}</p></div></div>)}
      </section>

      <section className="bg-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 border-y border-white/10">{["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-4 text-center font-black text-sm">✓ {t}</div>)}</section>

      <section id="nosotros" className="px-6 md:px-24 py-16"><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-4 text-white/70 max-w-3xl">Balladares Motors, taller bien conocido en Concepción con más de 15 años. Nacimos de la pasión por carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores profesionales, alineación 3D, balanceo y ajuste de motor completo en {ADDRESS}.</p></section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-4xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-8">{[{n:"Repro Stage 1/2",p:"Desde $180.000"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Balanceo",p:"Desde $12.000"},{n:"Ajuste Motor",p:"Cotizar"},{n:"Mecánica General",p:"Cotizar"}].map(s=><div key={s.n} className="border-2 border-black p-6"><div className="font-black">{s.n}</div><div className="text-[#E10600] font-bold">{s.p}</div><a href={WHATSAPP} target="_blank" className="mt-3 inline-block bg-[#E10600] text-white px-4 py-2 text-sm font-black">COTIZAR</a></div>)}</div></section>

      <section id="galeria" className="px-6 md:px-24 py-20 bg-black"><h2 className="text-4xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><p className="text-white/60 mt-2">Nuestro taller en {ADDRESS}</p><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">{gallery.map((src, idx)=><div key={idx} className="aspect-[4/3] bg-[#1A1A1A] overflow-hidden border border-white/10 group"><img src={src} onError={(e:any)=>e.currentTarget.src=`https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600`} alt={`taller ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /></div>)}</div></section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-black italic">CONTACTO / <span className="text-[#E10600]">UBICACIÓN</span></h2>
          <div className="mt-8 space-y-3 text-white/80 text-lg">
            <p><span className="text-[#E10600] font-black">Dirección:</span> {ADDRESS}</p>
            <p><span className="text-[#E10600] font-black">Horario:</span> Lun - Vie 09:00 a 18:30 / Sáb 09:00 a 14:00</p>
            <p><span className="text-[#E10600] font-black">WhatsApp:</span> +56 9 3228 5399</p>
            <a href={WHATSAPP} target="_blank" className="mt-6 inline-flex items-center gap-3 bg-[#25D366] text-black px-8 py-3 font-black"> <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.59 2 2.2 6.4 2.2 11.84c0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.41a9.85 9.85 0 0 0 4.64 1.18h.01c5.44 0 9.83-4.4 9.83-9.84a9.82 9.82 0 0 0-2.82-6.99zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.18 8.18 0 0 1-1.27-4.28c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81-.22-.08-.38-.12-.54.12s-.62.81-.77.97-.29.19-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43s-.54-1.31-.74-1.79c-.19-.46-.39-.4-.54-.41l-.46-.01c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.54c.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.16-.47-.29z"/></svg> HABLAR POR WHATSAPP</a>
          </div>
        </div>
        <div className="bg-white p-1 h-">
          <iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción,+Chile&z=17&output=embed" width="100%" height="100%" style={{border:0}} loading="lazy"></iframe>
        </div>
      </section>

      <footer className="py-8 text-center text-white/30 text-sm border-t border-white/10">© 2026 Balladares Motors - {ADDRESS} | +56 9 3228 5399</footer>

      {/* BOTON WHATSAPP CON LOGO REAL */}
      <a href={WHATSAPP} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-50 hover:scale-110 transition">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.59 2 2.2 6.4 2.2 11.84c0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.41a9.85 0 0 0 4.64 1.18h.01c5.44 0 9.83-4.4 9.83-9.84a9.82 9.82 0 0 0-2.82-6.99zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.18 8.18 0 0 1-1.27-4.28c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81-.22-.08-.38-.12-.54.12s-.62.81-.77.97-.29.19-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43s-.54-1.31-.74-1.79c-.19-.46-.39-.4-.54-.41l-.46-.01c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.54c.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.16-.47-.29z"/></svg>
      </a>
    </main>
  );
}