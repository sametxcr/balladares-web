"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

const heroSlides = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000&auto=format&fit=crop",
];

const frases = [
  "SERVICIOS DE REPROGRAMACIÓN DE ECU",
  "MECÁNICA GENERAL MULTIMARCA",
  "DIAGNÓSTICO CLARO Y PROFESIONAL",
  "DPF OFF • EGR OFF • STAGE 1 & 2"
];

const marcas = [
  { n:"Toyota", u:"https://upload.wikimedia.org/wikipedia/commons/e/e7/Toyota_EU.svg" },
  { n:"Ford", u:"https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg" },
  { n:"BMW", u:"https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg" },
  { n:"Mercedes", u:"https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg" },
  { n:"Audi", u:"https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg" },
  { n:"VW", u:"https://upload.wikimedia.org/wikipedia/commons/6/6d/Volkswagen_logo_2019.svg" },
  { n:"Honda", u:"https://upload.wikimedia.org/wikipedia/commons/7/7e/Honda_logo.png" },
  { n:"Nissan", u:"https://upload.wikimedia.org/wikipedia/commons/2/23/Nissan_logo.svg" },
  { n:"Chevy", u:"https://upload.wikimedia.org/wikipedia/commons/1/13/Chevrolet_logo.svg" },
  { n:"Hyundai", u:"https://upload.wikimedia.org/wikipedia/commons/4/44/Hyundai_Motor_Company_logo.svg" },
  { n:"Kia", u:"https://upload.wikimedia.org/wikipedia/commons/0/0d/Kia_logo.svg" },
  { n:"Porsche", u:"https://upload.wikimedia.org/wikipedia/commons/0/0a/Porsche_Shield.svg" },
  { n:"Subaru", u:"https://upload.wikimedia.org/wikipedia/commons/8/8d/Subaru_logo.svg" },
  { n:"Mazda", u:"https://upload.wikimedia.org/wikipedia/commons/c/c5/Mazda_logo_with_emblem.svg" },
  { n:"Jeep", u:"https://upload.wikimedia.org/wikipedia/commons/5/5a/Jeep_logo.svg" },
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
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/70"/></div>
        ))}
        <div className="relative z-10 text-center px-6 max-w-5xl w-full">
          {/* LOGO 50% MAS CHICO - CENTRADO */}
          <img src="/BB.png" alt="Balladares Motors" style={{width:"360px", maxWidth:"70vw", height:"auto", maxHeight:"100px", objectFit:"contain", margin:"0 auto", display:"block"}} />
          <div className="mt-8 h- flex items-center justify-center"><h1 className="text- md:text- font-black italic leading-none tracking-tighter">{frases[t]}</h1></div>
          <div className="mt-4 bg-white text-black inline-block px-6 py-2 font-mono font-black text- tracking-[0.15em] skew-x-[-12deg] border-l-4 border-[#E10600]"><span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • {ADDRESS}</span></div>
          <div className="mt-6 flex gap-3 justify-center"><a href="#servicios" className="bg-[#E10600] px-6 py-2.5 font-black italic text- skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-6 py-2.5 font-black italic text- skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      {/* CINTA LOGOS CHICA 20px - FIX GIGANTE */}
      <div style={{background:"white", height:"38px", display:"flex", alignItems:"center", overflow:"hidden", borderTop:"4px solid #E10600", borderBottom:"4px solid #E10600"}}>
        <div style={{display:"flex", animation:"marquee 70s linear infinite", gap:"36px", alignItems:"center"}}>
          {[...marcas,...marcas,...marcas,...marcas].map((m,idx)=>
            <img key={idx} src={m.u} alt={m.n} style={{height:"18px", width:"auto", objectFit:"contain", flexShrink:0}} />
          )}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-25%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 items-center bg-black">
        <div><h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-6 text-white/70 text-sm">Balladares Motors en {ADDRESS}</p></div>
        <div className="relative max-w- ml-auto p- bg-zinc-400"><img src="/taller/2.jpg" className="w-full h- object-cover" alt="Entrada"/></div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text-5xl font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-10">{[{n:"Reprogramación ECU",p:"Potencia + Economía"},{n:"DPF OFF",p:"Solución definitiva"},{n:"EGR OFF",p:"Sin fallas"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Mecánica General",p:"Todas las marcas"}].map(s=><div key={s.n} className="border- border-black p-6"><div className="font-black italic">{s.n}</div><div className="text-[#E10600] font-bold text-sm">{s.p}</div></div>)}</div></section>

      <section id="galeria" className="px-6 md:px-24 py-20 bg-[#0A0A0A]"><h2 className="text-5xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">{[1,2,3,4,5,6].map(n=><div key={n} className="p- bg-zinc-500"><img src={`/taller/${n}.jpg`} className="w-full aspect-[4/3] object-cover" alt="taller"/></div>)}</div></section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12"><div><h2 className="text-4xl font-black italic">CONTACTO</h2><p className="mt-4 text-sm">{ADDRESS}<br/>+56 9 3228 5399</p><a href={WHATSAPP} target="_blank" className="mt-6 inline-flex bg-[#25D366] text-white px-8 py-3 font-black rounded-full">WHATSAPP</a></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="350" style={{border:0}}></iframe></section>
    </main>
  );
}
