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

const frases = ["SERVICIOS DE REPROGRAMACIÓN DE ECU","MECÁNICA GENERAL MULTIMARCA","DIAGNÓSTICO CLARO Y PROFESIONAL","DPF OFF • EGR OFF • STAGE 1 & 2"];

// 15 MARCAS - TODAS SVG NEGRAS QUE SI SE VEN
const marcas = [
  "https://cdn.worldvectorlogo.com/logos/ford-6.svg",
  "https://cdn.worldvectorlogo.com/logos/bmw.svg",
  "https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg",
  "https://cdn.worldvectorlogo.com/logos/audi-14.svg",
  "https://cdn.worldvectorlogo.com/logos/volkswagen.svg",
  "https://cdn.worldvectorlogo.com/logos/toyota-1.svg",
  "https://cdn.worldvectorlogo.com/logos/honda-4.svg",
  "https://cdn.worldvectorlogo.com/logos/nissan-6.svg",
  "https://cdn.worldvectorlogo.com/logos/hyundai.svg",
  "https://cdn.worldvectorlogo.com/logos/kia-motors-1.svg",
  "https://cdn.worldvectorlogo.com/logos/chevrolet.svg",
  "https://cdn.worldvectorlogo.com/logos/porsche-6.svg",
  "https://cdn.worldvectorlogo.com/logos/subaru-4.svg",
  "https://cdn.worldvectorlogo.com/logos/mazda-2.svg",
  "https://cdn.worldvectorlogo.com/logos/jeep-5.svg",
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
        {heroSlides.map((src,idx)=><div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/70"/></div>)}
        <div className="relative z-10 text-center px-6 max-w-5xl w-full">
          <img src="/BB.png" alt="Balladares Motors" style={{width:"360px", maxWidth:"70vw", height:"auto", maxHeight:"100px", objectFit:"contain", margin:"0 auto", display:"block"}} />
          <div className="mt-8 h- flex items-center justify-center"><h1 className="text- md:text- font-black italic leading-none tracking-tighter">{frases[t]}</h1></div>
          <div className="mt-4 bg-white text-black inline-block px-6 py-2 font-mono font-black text- tracking-[0.15em] skew-x-[-12deg] border-l-4 border-[#E10600]"><span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • {ADDRESS}</span></div>
        </div>
      </section>

      {/* CINTA ALUMINIO DIAMANTADO - 15 MARCAS TODAS VISIBLES */}
      <div style={{
        height:"46px",
        backgroundColor:"#c2c8ce",
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239aa0a8' fillOpacity='0.4'%3E%3Cpath d='M0 20 L10 10 L20 20 L10 30 Z M20 20 L30 10 L40 20 L30 30 Z M10 0 L20 10 L10 20 L0 10 Z M30 0 L40 10 L30 20 L20 10 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        borderTop:"4px solid #E10600",
        borderBottom:"4px solid #E10600",
        display:"flex",
        alignItems:"center",
        overflow:"hidden"
      }}>
        <div style={{background:"rgba(255,255,255,0.94)", height:"30px", display:"flex", alignItems:"center", width:"100%"}}>
          <div style={{display:"flex", animation:"marquee 35s linear infinite", gap:"28px", alignItems:"center"}}>
            {[...marcas,...marcas,...marcas,...marcas].map((url,idx)=>
              <img key={idx} src={url} alt="marca" style={{height:"20px", width:"auto", maxWidth:"80px", objectFit:"contain", flexShrink:0}} />
            )}
          </div>
        </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-25%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 items-center bg-black"><div><h2 className="text-5xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2></div><img src="/taller/2.jpg" className="w-full max-w- h- object-cover border-2 border-[#E10600] ml-auto" alt="taller"/></section>
      <section id="galeria" className="px-6 md:px-24 py-16 bg-[#0A0A0A]"><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">{[1,2,3,4,5,6].map(n=><img key={n} src={`/taller/${n}.jpg`} className="w-full aspect-[4/3] object-cover border border-white/10" alt="taller"/>)}</div></section>
      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-12 grid md:grid-cols-2 gap-8"><div><h2 className="text-4xl font-black italic">CONTACTO</h2><p className="mt-4 text-sm">{ADDRESS}</p></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="350" style={{border:0}}></iframe></section>
    </main>
  );
}
