"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

const heroSlides = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083",
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000",
  "/taller/2.jpg",
];

const marcas = ["TOYOTA","HYUNDAI","CHEVROLET","NISSAN","FORD","KIA","SUZUKI","MITSUBISHI","MAZDA","SUBARU","BMW","MERCEDES-BENZ","AUDI","VOLKSWAGEN","PEUGEOT","RENAULT","PORSCHE","JEEP","HONDA"];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4000);return()=>clearInterval(t)},[]);

  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur border-b-2 border-[#E10600] flex justify-between items-center px-6 py-3">
        <img src="/logo-principal.png" alt="logo nav" className="h-8 md:h-10 w-auto object-contain" />
        <div className="hidden md:flex gap-6 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black italic skew-x-[-15deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/70"/><div className="absolute inset-0 opacity-10" style={{backgroundImage:`repeating-linear-gradient(45deg, white 0 15px, transparent 15px 30px)`}}/></div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <img src="/logo-principal.png" alt="Balladares" className="h-24 md:h-36 w-auto mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
          <h1 className="mt-8 text-4xl md:text-6xl font-black italic leading-none tracking-tighter">SERVICIOS DE<br/><span className="text-[#E10600]">REPROGRAMACIÓN DE ECU</span></h1>
          <div className="mt-4 bg-white text-black inline-block px-6 py-2 font-black italic text-sm md:text-base skew-x-[-12deg]"><span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • DIAGNÓSTICO PRO • {ADDRESS}</span></div>
          <div className="mt-8 flex gap-4 justify-center"><a href="#servicios" className="bg-[#E10600] px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      {/* CINTA ROJA + CINTA DE MARCAS DONDE MARCASTE */}
      <div className="bg-[#E10600] text-black font-black italic py-3 overflow-hidden">
        <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap gap-10 text-sm tracking-widest">
          {[...marcas,...marcas].map((m, idx)=><span key={idx} className="flex items-center gap-10">{m} <span className="opacity-40">/</span></span>)}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-10 items-start bg-black">
        <div>
          <h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2>
          {/* AQUI VAMOS A PONER LA RESEÑA QUE ME DIGAS */}
          <p className="mt-6 text-white/70 leading-relaxed text-sm">Balladares Motors, taller bien conocido en Concepción. [Aquí pondremos tu reseña completa de 3-4 párrafos que me mandes ahora: cómo partieron, años en pista, por qué son especialistas en ECU, etc.] Ubicados en {ADDRESS}.</p>
          <img src="/logo-lubricentro.png" className="mt-6 h-14 w-auto opacity-80" alt="lubricentro"/>
        </div>
        {/* IMAGEN ACHICADA A LA MITAD */}
        <div className="relative max-w- ml-auto">
          <div className="absolute -inset-2 bg-[#E10600] skew-x-[-3deg]"/>
          <img src="/taller/2.jpg" className="relative w-full h- object-cover skew-x-[-3deg]" alt="fachada"/>
          <p className="mt-3 text-xs text-white/40 italic">Fachada taller {ADDRESS}</p>
        </div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-5xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-10">{[{n:"Reprogramación ECU",p:"Potencia + Economía"},{n:"DPF OFF",p:"Solución definitiva"},{n:"EGR OFF",p:"Sin fallas"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Mecánica General",p:"Gama alta"}].map(s=><div key={s.n} className="border- border-black p-6"><div className="font-black italic">{s.n}</div><div className="text-[#E10600] font-bold text-sm">{s.p}</div><a href={WHATSAPP} className="mt-3 inline-block bg-[#E10600] text-white px-4 py-2 text-xs font-black">COTIZAR</a></div>)}</div></section>

      <section id="galeria" className="px-6 md:px-24 py-20 bg-black"><h2 className="text-5xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">{[1,2,3,4,5,6].map(n=><img key={n} src={`/taller/${n}.jpg`} className="aspect-[4/3] object-cover border border-white/10" alt="taller"/>)}</div></section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12"><div><h2 className="text-4xl font-black italic">CONTACTO / <span className="text-[#E10600]">UBICACIÓN</span></h2><p className="mt-6"><b className="text-[#E10600]">Dirección:</b> {ADDRESS}</p><p><b className="text-[#E10600]">WhatsApp:</b> +56 9 3228 5399</p><a href={WHATSAPP} className="mt-6 inline-block bg-[#25D366] text-black px-8 py-3 font-black">HABLAR POR WHATSAPP</a></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="350" style={{border:0}} loading="lazy"></iframe></section>
      <a href={WHATSAPP} className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center z-50"><svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M19.05 4.94A9.91 0 0 0 12.03 2C6.59 2 2.2 6.4 2.2 11.84c0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.41a9.85 0 0 0 4.64 1.18h.01c5.44 0 9.83-4.4 9.83-9.84a9.82 9.82 0 0 0-2.82-6.99zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.18 0 0 1-1.27-4.28c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81-.22-.08-.38-.12-.54.12s-.62.81-.77.97-.29.19-.54.06a6.7 0 0 1-1.97-1.22 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43s-.54-1.31-.74-1.79c-.19-.46-.39-.4-.54-.41l-.46-.01c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.54c.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.16-.47-.29z"/></svg></a>
    </main>
  );
}
