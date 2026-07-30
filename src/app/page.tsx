"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20en%20Rodolfo%20Briceño%202718`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

// SOLO AUTOS - 0 FOTOS LOCALES
const heroSlides = [
 
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511910849309-0dffb8785146?q=80&w=2000&auto=format&fit=crop",
];

const frases = ["SERVICIOS DE REPROGRAMACIÓN DE ECU","MECÁNICA GENERAL MULTIMARCA","DIAGNÓSTICO CLARO Y PROFESIONAL","DPF OFF • EGR OFF • STAGE 1 & 2"];

// LOGOS EN PNG QUE SI CARGAN EN VERCEL - CHICOS
const marcas = [
  { n:"Toyota", u:"https://1000logos.net/wp-content/uploads/2018/02/Toyota-logo.png" },
  { n:"Ford", u:"https://1000logos.net/wp-content/uploads/2022/07/Ford-logo.png" },
  { n:"BMW", u:"https://1000logos.net/wp-content/uploads/2018/02/BMW-logo.png" },
  { n:"Mercedes", u:"https://1000logos.net/wp-content/uploads/2018/10/Mercedes-Benz-logo.png" },
  { n:"Audi", u:"https://1000logos.net/wp-content/uploads/2016/10/Audi-logo.png" },
  { n:"VW", u:"https://1000logos.net/wp-content/uploads/2021/11/VW-logo.png" },
  { n:"Honda", u:"https://1000logos.net/wp-content/uploads/2021/09/Honda-logo.png" },
  { n:"Nissan", u:"https://1000logos.net/wp-content/uploads/2021/08/Nissan-logo.png" },
  { n:"Chevrolet", u:"https://1000logos.net/wp-content/uploads/2021/04/Chevrolet-logo.png" },
  { n:"Hyundai", u:"https://1000logos.net/wp-content/uploads/2021/05/Hyundai-logo.png" },
  { n:"Kia", u:"https://1000logos.net/wp-content/uploads/2021/11/KIA-logo.png" },
  { n:"Porsche", u:"https://1000logos.net/wp-content/uploads/2021/09/Porsche-logo.png" },
  { n:"Subaru", u:"https://1000logos.net/wp-content/uploads/2021/05/Subaru-logo.png" },
  { n:"Mazda", u:"https://1000logos.net/wp-content/uploads/2021/05/Mazda-logo.png" },
  { n:"Jeep", u:"https://1000logos.net/wp-content/uploads/2021/05/Jeep-logo.png" },
];

export default function Page(){
  const [i,setI]=useState(0);
  const [t,setT]=useState(0);
  useEffect(()=>{const a=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4500);const b=setInterval(()=>setT(p=>(p+1)%frases.length),3000);return()=>{clearInterval(a);clearInterval(b)}},[]);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black h- flex items-center justify-center px-6 border-b-2 border-[#E10600]">
        <div className="flex gap-6 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} className="absolute right-0 top-0 h-full bg-[#E10600] px-6 flex items-center font-black text-">COTIZAR</a>
      </nav>

      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=><div key={idx} className={`absolute inset-0 transition-opacity duration-700 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/70"/></div>)}
        <div className="relative z-10 text-center px-4 w-full max-w-4xl">
          {/* LOGO A LA MITAD - CENTRADO - NO GIGANTE */}
          <img src="/BB.png" alt="Balladares" className="mx-auto h-auto w- md:w- max-w- object-contain" style={{maxHeight:"110px"}} />
          <div className="mt-6 h- flex items-center justify-center"><h1 className="text- md:text- font-black italic leading-none">{frases[t]}</h1></div>
          <div className="mt-3 bg-white text-black inline-block px-5 py-1.5 text- md:text- font-bold tracking-[0.15em] skew-x-[-12deg]"><span className="block skew-x-">DPF OFF • EGR OFF • POTENCIA REAL • {ADDRESS}</span></div>
          <div className="mt-6 flex gap-3 justify-center"><a href="#servicios" className="bg-[#E10600] px-5 py-2 text- font-black skew-x-[-12deg]"><span className="block skew-x-">VER SERVICIOS →</span></a><a href={WHATSAPP} className="bg-white text-black px-5 py-2 text- font-black skew-x-[-12deg]"><span className="block skew-x-">WHATSAPP</span></a></div>
        </div>
      </section>

      {/* CINTA MARCAS - CHICA - 18px - LENTA */}
      <div className="bg-white h- flex items-center overflow-hidden border-y-2 border-[#E10600]">
        <div className="flex animate-[marquee_70s_linear_infinite] items-center gap-8">
          {[...marcas,...marcas,...marcas].map((m,idx)=><img key={idx} src={m.u} alt={m.n} className="h- w-auto object-contain shrink-0" loading="lazy" />)}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-12 grid md:grid-cols-2 gap-8 bg-black items-center"><div><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-4 text-white/60 text-sm">Entrada real del taller 2.jpg</p></div><img src="/taller/2.jpg" className="w-full max-w- h- object-cover border-2 border-[#E10600] ml-auto" alt="taller"/></section>

      <section id="galeria" className="px-6 md:px-24 py-16 bg-[#0A0A0A]"><h2 className="text-4xl font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">{[1,2,3,4,5,6].map(n=><div key={n} className="border border-white/10"><img src={`/taller/${n}.jpg`} className="w-full aspect-[4/3] object-cover" alt="taller"/></div>)}</div></section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-12 grid md:grid-cols-2 gap-8"><div><h2 className="text-3xl font-black italic">CONTACTO</h2><p className="mt-3 text-sm">{ADDRESS}<br/>+56 9 3228 5399</p></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="300" style={{border:0}}></iframe></section>
    </main>
  );
}
