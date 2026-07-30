"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

const heroSlides = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083",
];

const frases = [
  "SERVICIOS DE REPROGRAMACIÓN DE ECU",
  "MECÁNICA GENERAL MULTIMARCA",
  "DIAGNÓSTICO CLARO Y PROFESIONAL",
  "DPF OFF • EGR OFF • STAGE 1 & 2"
];

const marcasLogos = [
  { n:"ford", url:"https://cdn.worldvectorlogo.com/logos/ford-6.svg" },
  { n:"bmw", url:"https://cdn.worldvectorlogo.com/logos/bmw.svg" },
  { n:"mercedes", url:"https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg" },
  { n:"audi", url:"https://cdn.worldvectorlogo.com/logos/audi-14.svg" },
  { n:"vw", url:"https://cdn.worldvectorlogo.com/logos/volkswagen.svg" },
  { n:"nissan", url:"https://cdn.worldvectorlogo.com/logos/nissan-6.svg" },
  { n:"honda", url:"https://cdn.worldvectorlogo.com/logos/honda-4.svg" },
  { n:"toyota", url:"https://cdn.worldvectorlogo.com/logos/toyota-1.svg" },
  { n:"hyundai", url:"https://cdn.worldvectorlogo.com/logos/hyundai.svg" },
  { n:"chevrolet", url:"https://cdn.worldvectorlogo.com/logos/chevrolet.svg" },
];

export default function Page(){
  const [i,setI]=useState(0);
  const [t,setT]=useState(0);
  useEffect(()=>{const a=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4000);const b=setInterval(()=>setT(p=>(p+1)%frases.length),2800);return()=>{clearInterval(a);clearInterval(b)}},[]);

  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      {/* NAV SIN LOGO IZQUIERDA */}
      <nav className="fixed top-0 w-full z-50 bg-black h- flex justify-center md:justify-between items-center px-6 border-b-2 border-[#E10600]">
        <div className="hidden md:flex gap-8 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="absolute right-0 top-0 h-full bg-[#E10600] px-8 flex items-center font-black italic skew-x-[-15deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/70"/></div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          {/* LOGO CENTRO BLANCO BB.png PARA QUE RESALTE */}
          <img src="/BB.png" alt="Balladares Motors" className="h-20 md:h-28 w-auto mx-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.9)] brightness-0 invert" />
          <div className="mt-2"><img src="/logo-principal.png" alt="motors" className="h-14 md:h-20 w-auto mx-auto hidden" /> {/* respaldo por si BB no carga */}</div>
          
          <div className="mt-10 h- flex items-center justify-center"><h1 className="text-4xl md:text-6xl font-black italic leading-none tracking-tighter">{frases[t]}</h1></div>

          <div className="mt-4 bg-white/95 text-black inline-block px-8 py-2 font-mono font-black text- md:text-xs tracking-[0.2em] skew-x-[-12deg] border-l-4 border-[#E10600]">
            <span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • DIAGNÓSTICO PRO • {ADDRESS}</span>
          </div>
          <div className="mt-8 flex gap-4 justify-center"><a href="#servicios" className="bg-[#E10600] px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      <div className="bg-white py-3 overflow-hidden border-y-4 border-[#E10600]"><div className="flex animate-[marquee_30s_linear_infinite] gap-12 items-center">{[...marcasLogos,...marcasLogos,...marcasLogos].map((m,idx)=><img key={idx} src={m.url} alt={m.n} className="h-7 w-auto grayscale opacity-80"/>)}</div></div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>

      {/* NOSOTROS CON FOTO 2.jpg ENTRADA TALLER */}
      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 items-center bg-black">
        <div><h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-6 text-white/70 text-sm leading-relaxed">Balladares Motors, taller bien conocido en Concepción. Aquí va tu reseña completa. Por ahora dejamos la entrada del taller como imagen principal.</p><p className="mt-3 text-white/50 text-xs">Ubicados en {ADDRESS}</p></div>
        <div className="relative max-w- ml-auto"><div className="absolute -inset-2 bg-[#E10600]"/><img src="/taller/2.jpg" className="relative w-full h- object-cover" alt="Entrada taller"/></div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-5xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-10">{[{n:"Reprogramación ECU",p:"Potencia + Economía"},{n:"DPF OFF",p:"Solución definitiva"},{n:"EGR OFF",p:"Sin fallas"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Mecánica General",p:"Todas las marcas"}].map(s=><div key={s.n} className="border- border-black p-6"><div className="font-black italic">{s.n}</div><div className="text-[#E10600] font-bold text-sm">{s.p}</div><a href={WHATSAPP} className="mt-3 inline-block bg-[#E10600] text-white px-4 py-2 text-xs font-black">COTIZAR</a></div>)}</div></section>

      {/* GALERIA DEVUELTA */}
      <section id="galeria" className="px-6 md:px-24 py-20 bg-[#0A0A0A]"><h2 className="text-5xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><p className="text-white/60 mt-2">Fotos reales del taller en {ADDRESS}</p><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">{[1,3,4,5,6,2].map(n=><div key={n} className="aspect-[4/3] overflow-hidden border border-white/10"><img src={`/taller/${n}.jpg`} className="w-full h-full object-cover hover:scale-110 transition duration-500" alt="taller"/></div>)}</div></section>

      {/* CONTACTO CON LOGO VERDE WHATSAPP */}
      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12">
        <div><h2 className="text-4xl font-black italic">CONTACTO / <span className="text-[#E10600]">UBICACIÓN</span></h2>
          <div className="mt-8 space-y-3 text-white/80">
            <p><span className="text-[#E10600] font-black">Dirección:</span> {ADDRESS}</p>
            <p><span className="text-[#E10600] font-black">WhatsApp:</span> +56 9 3228 5399</p>
            <a href={WHATSAPP} target="_blank" className="mt-6 inline-flex items-center gap-3 bg-[#25D366] text-white px-8 py-3 font-black text-lg rounded-full"><svg viewBox="0 0 24 24" width="26" height="26" fill="white"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.59 2 2.2 6.4 2.2 11.84c0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.41a9.85 0 0 0 4.64 1.18h.01c5.44 0 9.83-4.4 9.83-9.84a9.82 0 0 0-2.82-6.99zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.18 0 0 1-1.27-4.28c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81-.22-.08-.38-.12-.54.12s-.62.81-.77.97-.29.19-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43s-.54-1.31-.74-1.79c-.19-.46-.39-.4-.54-.41l-.46-.01c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.54c.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.16-.47-.29z"/></svg> HABLAR POR WHATSAPP</a>
          </div>
        </div>
        <iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="350" style={{border:0}} loading="lazy"></iframe>
      </section>

      <footer className="py-6 text-center text-white/30 text-xs border-t border-white/10">© 2026 Balladares Motors - {ADDRESS}</footer>

      <a href={WHATSAPP} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl z-50"><svg viewBox="0 0 24 24" width="28" height="28" fill="white"><path d="M19.05 4.94A9.91 9.91 0 0 0 12.03 2C6.59 2 2.2 6.4 2.2 11.84c0 1.73.45 3.42 1.31 4.91L2 22l5.39-1.41a9.85 0 0 0 4.64 1.18h.01c5.44 0 9.83-4.4 9.83-9.84a9.82 0 0 0-2.82-6.99zm-7.02 15.1h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.18 0 0 1-1.27-4.28c0-4.5 3.66-8.16 8.17-8.16 2.18 0 4.23.85 5.77 2.39a8.1 0 0 1 2.39 5.77c0 4.5-3.66 8.16-8.16 8.16zm4.48-6.12c-.25-.12-1.47-.72-1.69-.81-.22-.08-.38-.12-.54.12s-.62.81-.77.97-.29.19-.54.06a6.7 6.7 0 0 1-1.97-1.22 7.4 0 0 1-1.37-1.7c-.14-.25-.01-.39.11-.51.11-.11.25-.29.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43s-.54-1.31-.74-1.79c-.19-.46-.39-.4-.54-.41l-.46-.01c-.16 0-.43.06-.65.31s-.86.84-.86 2.05.88 2.38 1 2.54c.12.16 1.74 2.66 4.21 3.73.59.25 1.05.4 1.41.51.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.07.14-1.18-.06-.11-.22-.16-.47-.29z"/></svg></a>
    </main>
  );
}
