"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

const heroSlides = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000",
];

const frases = [
  "SERVICIOS DE REPROGRAMACIÓN DE ECU",
  "MECÁNICA GENERAL MULTIMARCA",
  "DIAGNÓSTICO CLARO Y PROFESIONAL",
  "DPF OFF • EGR OFF • STAGE 1 & 2"
];

// LOGOS PNG A COLOR PEQUEÑOS - NO SVG GIGANTES
const marcasLogos = [
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Toyota_EU.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg",
  "https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/02/Audi_logo_detail.svg",
  "https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8e/Hyundai_Motor_Company_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7e/Honda_logo.png",
  "https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/1/13/Chevrolet_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/0d/Kia_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5a/Porsche_Wappen.svg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8d/Subaru_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/f/fa/Mazda_logo_with_emblem.svg",
  "https://upload.wikimedia.org/wikipedia/commons/2/26/Mitsubishi_logomark.svg",
];

export default function Page(){
  const [i,setI]=useState(0);
  const [t,setT]=useState(0);
  useEffect(()=>{const a=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4000);const b=setInterval(()=>setT(p=>(p+1)%frases.length),2800);return()=>{clearInterval(a);clearInterval(b)}},[]);

  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black h- flex justify-center md:justify-between items-center px-6 border-b-2 border-[#E10600]">
        <div className="hidden md:flex gap-8 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="absolute right-0 top-0 h-full bg-[#E10600] px-8 flex items-center font-black italic skew-x-[-15deg]"><span className="block skew-x-">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/65"/></div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-5xl w-full">
          {/* LOGO CENTRADO TAMAÑO ACORDE - NO GIGANTE */}
          <div className="flex justify-center">
            <img src="/BB.png" alt="Balladares Motors" className="h- md:h- w-auto object-contain max-w-" />
          </div>
          
          <div className="mt-8 h- md:h- flex items-center justify-center"><h1 className="text- md:text- font-black italic leading-none tracking-tighter">{frases[t]}</h1></div>

          <div className="mt-4 bg-white text-black inline-block px-6 py-2 font-mono font-black text- md:text- tracking-[0.2em] skew-x-[-12deg] border-l-4 border-[#E10600]">
            <span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • DIAGNÓSTICO PRO • {ADDRESS}</span>
          </div>
          <div className="mt-8 flex gap-3 justify-center"><a href="#servicios" className="bg-[#E10600] px-6 py-2.5 font-black italic text- skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-6 py-2.5 font-black italic text- skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      {/* CINTA LOGOS CHICA A COLOR - LENTA */}
      <div className="bg-white py-2 overflow-hidden border-y-4 border-[#E10600] flex items-center h-">
        <div className="flex animate-[marquee_60s_linear_infinite] items-center gap-10 whitespace-nowrap">
          {[...marcasLogos,...marcasLogos,...marcasLogos,...marcasLogos].map((url,idx)=>
            <img key={idx} src={url} alt="marca" className="h- w-auto object-contain shrink-0" />
          )}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-25%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 items-center bg-black">
        <div><h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-6 text-white/70 text-sm">Taller bien conocido en Concepción. {ADDRESS}</p></div>
        <div className="relative max-w- ml-auto p- bg-[#888]"><img src="/taller/2.jpg" className="w-full h- object-cover" alt="Entrada taller"/></div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-5xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-10">{[{n:"Reprogramación ECU",p:"Potencia + Economía"},{n:"DPF OFF",p:"Solución definitiva"},{n:"EGR OFF",p:"Sin fallas"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Mecánica General",p:"Todas las marcas"}].map(s=><div key={s.n} className="border- border-black p-6"><div className="font-black italic">{s.n}</div><div className="text-[#E10600] font-bold text-sm">{s.p}</div></div>)}</div></section>

      <section id="galeria" className="px-6 md:px-24 py-20 bg-[#0A0A0A]"><h2 className="text-5xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">{[1,2,3,4,5,6].map(n=><div key={n} className="p- bg-zinc-600"><img src={`/taller/${n}.jpg`} className="w-full aspect-[4/3] object-cover" alt="taller"/></div>)}</div></section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12"><div><h2 className="text-4xl font-black italic">CONTACTO</h2><p className="mt-4">{ADDRESS}</p><a href={WHATSAPP} className="mt-6 inline-flex gap-3 bg-[#25D366] text-white px-8 py-3 font-black rounded-full">WHATSAPP</a></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="350" style={{border:0}}></iframe></section>
    </main>
  );
}
