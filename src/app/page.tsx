"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

// 1. FONDOS RACING REALES - nada de verduras
const heroSlides = [
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070", // porsche
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083", // motor
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000", // quemada neumatico
  "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073", // taller racing
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070", // auto deportivo
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083",
];

// 2. FRASES QUE ROTAN EN CARRUSEL
const frases = [
  "SERVICIOS DE REPROGRAMACIÓN DE ECU",
  "MECÁNICA GENERAL MULTIMARCA",
  "DIAGNÓSTICO CLARO Y PROFESIONAL",
  "DPF OFF • EGR OFF • STAGE 1 & 2"
];

// 3. LOGOS DE MARCAS - con imágenes reales
const marcasLogos = [
  { n:"toyota", url:"https://cdn.worldvectorlogo.com/logos/toyota-1.svg" },
  { n:"hyundai", url:"https://cdn.worldvectorlogo.com/logos/hyundai.svg" },
  { n:"chevrolet", url:"https://cdn.worldvectorlogo.com/logos/chevrolet.svg" },
  { n:"ford", url:"https://cdn.worldvectorlogo.com/logos/ford-6.svg" },
  { n:"bmw", url:"https://cdn.worldvectorlogo.com/logos/bmw.svg" },
  { n:"mercedes", url:"https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg" },
  { n:"audi", url:"https://cdn.worldvectorlogo.com/logos/audi-14.svg" },
  { n:"vw", url:"https://cdn.worldvectorlogo.com/logos/volkswagen.svg" },
  { n:"nissan", url:"https://cdn.worldvectorlogo.com/logos/nissan-6.svg" },
  { n:"honda", url:"https://cdn.worldvectorlogo.com/logos/honda-4.svg" },
];

export default function Page(){
  const [i,setI]=useState(0);
  const [t,setT]=useState(0);
  useEffect(()=>{const a=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4000);const b=setInterval(()=>setT(p=>(p+1)%frases.length),2500);return()=>{clearInterval(a);clearInterval(b)}},[]);

  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      {/* NAV - AHORA CON BB.png BLANCO Y MAS ALTO PARA NO TAPAR */}
      <nav className="fixed top-0 w-full z-50 bg-black h- flex justify-between items-center px-6 border-b-2 border-[#E10600]">
        {/* 1. LOGO BLANCO ESQUINA IZQUIERDA */}
        <img src="/BB.png" alt="Balladares chico" className="h- w-auto object-contain" />
        <div className="hidden md:flex gap-6 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black italic skew-x-[-15deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      {/* HERO - CON PADDING TOP PARA QUE NO LO TAPE EL NAV */}
      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/75"/></div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          {/* LOGO GRANDE - YA NO TAPADO */}
          <img src="/logo-principal.png" alt="Balladares Motors Principal" className="h-28 md:h-40 w-auto mx-auto drop-shadow-[0_0_40px_rgba(0,0,0,0.9)]" />

          {/* 3. TEXTO EN CARRUSEL */}
          <div className="mt-10 h- md:h- overflow-hidden">
            <h1 className="text-4xl md:text-6xl font-black italic leading-none tracking-tighter transition-all duration-500">{frases[t]}</h1>
          </div>

          {/* 4. SUBTITULO MAS PRO */}
          <div className="mt-4 bg-white/95 text-black inline-block px-8 py-2 font-mono font-black text- md:text-sm tracking-[0.2em] skew-x-[-12deg] border-l-4 border-[#E10600]">
            <span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • DIAGNÓSTICO PRO • {ADDRESS}</span>
          </div>

          <div className="mt-8 flex gap-4 justify-center"><a href="#servicios" className="bg-[#E10600] px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-8 py-3 font-black italic skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      {/* 5. MARCAS CON LOGOS REALES */}
      <div className="bg-white text-black py-3 overflow-hidden border-y-4 border-[#E10600]">
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-12 items-center">
          {[...marcasLogos,...marcasLogos,...marcasLogos].map((m, idx)=><img key={idx} src={m.url} alt={m.n} className="h-8 w-auto grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition"/>)}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-10 items-start bg-black">
        <div><h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-6 text-white/70 text-sm leading-relaxed">Aquí irá tu reseña de 3-4 párrafos. [Mándame el texto y lo pongo]. Ubicados en {ADDRESS}.</p><img src="/logo-lubricentro.png" className="mt-6 h-14 w-auto" alt="lubri"/></div>
        <div className="relative max-w- ml-auto"><div className="absolute -inset-2 bg-[#E10600] skew-x-[-3deg]"/><img src="/taller/1.jpg" className="relative w-full h- object-cover skew-x-[-3deg]" alt="fachada"/></div>
      </section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-12 grid md:grid-cols-2 gap-12"><div><h2 className="text-4xl font-black italic">CONTACTO</h2><p className="mt-4">{ADDRESS}</p><p>+56 9 3228 5399</p><a href={WHATSAPP} className="mt-6 inline-block bg-[#25D366] text-black px-8 py-3 font-black">WHATSAPP</a></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="300" style={{border:0}} loading="lazy"></iframe></section>
    </main>
  );
}
