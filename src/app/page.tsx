"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/56912345678?text=Hola%20Balladares%20Motors,%20quiero%20cotizar";
const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca todas las marcas", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073" },
];
const gallery = [
  "/taller/1.jpg","/taller/2.jpg","/taller/3.jpg","/taller/4.jpg","/taller/5.jpg","/taller/6.jpg"
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);
  return (
    <main className="bg-[#0A0A0A] text-white">
      <nav className="fixed top-0 w-full z-50 bg-black border-b border-[#E10600] flex justify-between items-center px-6 py-2">
        <div className="font-black italic text-xl"><span className="text-white">BALLADARES</span> <span className="bg-[#E10600] px-2 skew-x-[-12deg] inline-block"><span className="block skew-x-">MOTORS</span></span></div>
        <div className="hidden md:flex gap-6 text-sm font-black"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERIA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black skew-x-[-12deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="h- relative overflow-hidden mt-">
        {slides.map((s,idx)=><div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx===i?"opacity-100":"opacity-0 pointer-events-none"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover"}}><div className="absolute inset-0 bg-black/60"/><div className="relative h-full flex flex-col justify-center px-10 md:px-24"><h1 className="text-5xl md:text-7xl font-black italic">{s.title}</h1><p className="mt-4 bg-white text-black px-4 py-1 font-bold w-fit skew-x-[-12deg]"><span className="block skew-x-">{s.sub}</span></p></div></div>)}
      </section>

      <section className="bg-[#1A1A1A] grid grid-cols-2 md:grid-cols-4 border-y border-white/10">{["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-4 text-center font-black text-sm">✓ {t}</div>)}</section>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-4 text-white/70">Taller bien conocido en Concepción. Pasión por carreras en pista y circuito, atendemos gama alta y todas las marcas. Elevadores, alineación 3D, balanceo y ajuste motor completo.</p></div>
        <img src="https://images.unsplash.com/photo-1625047509168-a7026f36de04?q=80&w=2070" className="w-full h-80 object-cover skew-x-[-6deg]" alt="taller"/>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-4xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-8">{[{n:"Repro Stage 1/2",p:"Desde $180.000"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Balanceo",p:"Desde $12.000"},{n:"Ajuste Motor",p:"Cotizar"},{n:"Mecánica General",p:"Cotizar"}].map(s=><div key={s.n} className="border-2 border-black p-6"><div className="font-black">{s.n}</div><div className="text-[#E10600] font-bold">{s.p}</div><a href={WHATSAPP} className="mt-3 inline-block bg-[#E10600] text-white px-4 py-2 text-sm font-black">COTIZAR</a></div>)}</div></section>

      {/* GALERIA NUEVA */}
      <section id="galeria" className="px-6 md:px-24 py-20 bg-black">
        <h2 className="text-4xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA REAL</span></h2>
        <p className="text-white/60 mt-2">Trabajos reales en pista y calle - Concepción</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
          {gallery.map((src, idx)=><div key={idx} className="aspect-[4/3] bg-[#1A1A1A] overflow-hidden border border-white/10 group"><img src={src} onError={(e:any)=>e.currentTarget.src=`https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&h=400&fit=crop`} alt={`taller ${idx}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" /></div>)}
        </div>
        <p className="text-xs text-white/30 mt-4">* Sube tus fotos a /public/taller/ para reemplazar estas de referencia</p>
      </section>

      {/* CONTACTO NUEVO */}
      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-4xl font-black italic">CONTACTO / <span className="text-[#E10600]">UBICACIÓN</span></h2>
          <div className="mt-8 space-y-4 text-white/80">
            <p><span className="text-[#E10600] font-black">Dirección:</span> [Pon tu dirección aquí] - Concepción, Biobío</p>
            <p><span className="text-[#E10600] font-black">Horario:</span> Lun - Vie 09:00 a 18:30 / Sáb 09:00 a 14:00</p>
            <p><span className="text-[#E10600] font-black">WhatsApp:</span> +56 9 XXXX XXXX</p>
            <a href={WHATSAPP} target="_blank" className="mt-6 inline-block bg-[#25D366] text-black px-8 py-3 font-black">HABLAR POR WHATSAPP</a>
          </div>
        </div>
        <div className="bg-white p-1">
          {/* Reemplaza el src con tu link de Google Maps */}
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3223.123!2d-73.05!3d-36.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzZCsDQ5JzEyLjAiUyA3M8KwMDMnMDAuMCJX!5e0!3m2!1ses!2scl!4v123" width="100%" height="350" style={{border:0}} loading="lazy"></iframe>
        </div>
      </section>

      <footer className="py-8 text-center text-white/30 text-sm border-t border-white/10">© 2026 Balladares Motors - Concepción</footer>
      <a href={WHATSAPP} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black z-50">W</a>
    </main>
  );
}