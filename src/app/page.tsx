"use client";
import { useState, useEffect } from "react";

const PHONE = "56932285399";
const WHATSAPP = `https://wa.me/${PHONE}?text=Hola%20Balladares%20Motors,%20quiero%20cotizar`;
const ADDRESS = "Rodolfo Briceño #2718, Concepción";

const heroSlides = [
  "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070",
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083",
];

const frases = ["SERVICIOS DE REPROGRAMACIÓN DE ECU","MECÁNICA GENERAL MULTIMARCA","DIAGNÓSTICO CLARO Y PROFESIONAL","DPF OFF • EGR OFF • STAGE 1 & 2"];

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
  useEffect(()=>{const a=setInterval(()=>setI(p=>(p+1)%heroSlides.length),4000);const b=setInterval(()=>setT(p=>(p+1)%frases.length),3000);return()=>{clearInterval(a);clearInterval(b)}},[]);
  return (
    <main className="bg-[#080808] text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black h- flex items-center justify-center px-6 border-b-2 border-[#E10600]">
        <div className="hidden md:flex gap-8 text- font-black tracking-widest"><a href="#inicio">INICIO</a><a href="#nosotros">NOSOTROS</a><a href="#servicios">SERVICIOS</a><a href="#galeria">GALERÍA</a><a href="#contacto">CONTACTO</a></div>
        <a href={WHATSAPP} target="_blank" className="absolute right-0 top-0 h-full bg-[#E10600] px-8 flex items-center font-black">COTIZAR</a>
      </nav>

      <section id="inicio" className="relative h- w-full overflow-hidden mt- flex items-center justify-center">
        {heroSlides.map((src,idx)=><div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i? "opacity-100" : "opacity-0"}`} style={{backgroundImage:`url(${src})`,backgroundSize:"cover",backgroundPosition:"center"}}><div className="absolute inset-0 bg-black/65"/></div>)}
        <div className="relative z-10 text-center px-6 max-w-6xl">
          <img src="/BB.png" alt="Balladares" className="h- md:h- w-auto mx-auto object-contain" />
          <div className="mt-8 min-h- flex items-center justify-center"><h1 className="text- md:text- font-black italic leading-[0.9] uppercase">{frases[t]}</h1></div>
          <div className="mt-4 bg-white text-black inline-block px-6 py-2 font-black text- tracking-[0.2em] skew-x-[-12deg]"><span className="block skew-x-">DPF OFF • EGR OFF • {ADDRESS}</span></div>
        </div>
      </section>

      {/* LOGOS CHIQUITOS PASANDO LENTO Y A COLOR */}
      <div className="bg-white py-2 overflow-hidden border-y- border-[#E10600]">
        <div className="flex animate-[marquee_60s_linear_infinite] gap-10 items-center">
          {[...marcasLogos,...marcasLogos,...marcasLogos,...marcasLogos].map((m,idx)=>
            <img key={idx} src={m.url} alt={m.n} className="h- md:h- w-auto object-contain shrink-0" />
          )}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-25%)}}`}</style>

      <section id="nosotros" className="px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 items-center bg-black">
        <div><h2 className="text- font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-4 text-white/60 text-">{ADDRESS}</p></div>
        <div className="relative max-w- ml-auto p- bg-[repeating-linear-gradient(45deg,#777_0_3px,#CCC_3px_6px,#777_6px_9px)]"><div className="bg-black p-1"><img src="/taller/2.jpg" className="w-full h- object-cover" alt="Entrada taller"/></div></div>
      </section>

      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-16"><h2 className="text- font-black italic">SERVICIOS</h2><div className="grid md:grid-cols-3 gap-6 mt-8">{[{n:"Reprogramación ECU",p:"Potencia"},{n:"DPF OFF",p:"Definitivo"},{n:"EGR OFF",p:"Sin fallas"},{n:"Scanner",p:"$25.000"},{n:"Alineación 3D",p:"$18.000"},{n:"Mecánica General",p:"Multimarca"}].map(s=><div key={s.n} className="border- border-black p-5"><div className="font-black italic">{s.n}</div><div className="text-[#E10600] text- font-bold">{s.p}</div></div>)}</div></section>

      {/* GALERIA CON MARCOS ALUMINIO DIAMANTADO - 6 FOTOS DE NUEVO */}
      <section id="galeria" className="px-6 md:px-24 py-20 bg-[#0A0A0A]"><h2 className="text- font-black italic">TALLER / <span className="text-[#E10600]">GALERÍA</span></h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-10">
          {[2,3,4,5,6,3].map((n,idx)=>(
            <div key={idx} className="p- bg-[linear-gradient(135deg,#8A8A8A,#E5E5E5,#8A8A8A)] shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              <div className="bg-black p-">
                <img src={`/taller/${n}.jpg`} className="w-full aspect-[4/3] object-cover" alt="taller"/>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="bg-[#111] px-6 md:px-24 py-16 grid md:grid-cols-2 gap-12 border-t-4 border-[#E10600]"><div><h2 className="text- font-black italic">CONTACTO</h2><p className="mt-4 text-">{ADDRESS}<br/>+56 9 3228 5399</p><a href={WHATSAPP} className="mt-6 inline-flex gap-2 bg-[#25D366] text-white px-6 py-3 font-black rounded-full text-">WHATSAPP</a></div><iframe src="https://www.google.com/maps?q=Rodolfo+Briceño+2718,+Concepción&z=17&output=embed" width="100%" height="320" style={{border:0}}></iframe></section>
    </main>
  );
}
