"use client";
import { useState, useEffect } from "react";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "/hero/hero1.jpg" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca para todas las marcas", img: "/hero/hero2.jpg" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "/hero/hero3.jpg" },
];

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
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);

  return (
    <main className="bg-black text-white">
      <nav className="fixed top-0 w-full z-50 bg-black/90 border-b border-[#E10600] flex justify-between items-center px-6 py-3">
        <div className="font-black text-xl italic tracking-wider"><span className="text-white">BALLADARES</span> <span className="bg-[#E10600] px-2 skew-x-[-12deg] inline-block"><span className="skew-x- inline-block">MOTORS</span></span></div>
        <div className="hidden md:flex gap-6 text-sm font-bold"><a href="#inicio">INICIO</a><a>NOSOTROS</a><a>SERVICIOS</a><a>CONTACTO</a></div>
        <a href="https://wa.me/56932285399" className="bg-[#E10600] px-5 py-2 font-black skew-x-[-12deg]"><span className="skew-x- block">COTIZAR</span></a>
      </nav>

      <section id="inicio" className="h- relative overflow-hidden mt-">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-black/60"/>
            <div className="relative h-full flex flex-col justify-center px-10 md:px-24">
              <h1 className="text-5xl md:text-8xl font-black italic leading-none max-w-4xl">{s.title}</h1>
              <p className="mt-4 text-xl bg-white text-black inline-block px-4 py-1 font-bold w-fit skew-x-[-12deg]"><span className="skew-x- block">{s.sub}</span></p>
              <button className="mt-8 w-fit bg-[#E10600] px-8 py-3 font-black skew-x-[-12deg]"><span className="skew-x- block">VER SERVICIOS →</span></button>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-10 flex gap-2">{slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 w-10 ${idx===i?"bg-[#E10600]":"bg-white/30"}`}/>)}</div>
      </section>

      {/* CINTA ALUMINIO DIAMANTADO - 15 MARCAS 26px NEGRO PURO */}
      <div style={{
        height:"58px",
        backgroundColor:"#c2c8ce",
        backgroundImage:`url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239aa0a8' fillOpacity='0.4'%3E%3Cpath d='M0 20 L10 10 L20 20 L10 30 Z M20 20 L30 10 L40 20 L30 30 Z'/%3E%3C/g%3E%3C/svg%3E")`,
        borderTop:"4px solid #E10600",
        borderBottom:"4px solid #E10600",
        display:"flex",
        alignItems:"center",
        overflow:"hidden"
      }}>
        <div style={{background:"white", height:"40px", display:"flex", alignItems:"center", width:"100%", overflow:"hidden"}}>
          {/* VELOCIDAD DE LA CINTA -> cambia 32s por 20s rapido o 50s lento */}
          <div style={{display:"flex", animation:"marquee 32s linear infinite", gap:"38px", alignItems:"center"}}>
            {[...marcas,...marcas,...marcas].map((url,idx)=>(
              <div key={idx} style={{height:"26px", display:"flex", alignItems:"center", flexShrink:0}}>
                <img src={url} alt="marca" style={{height:"26px", width:"auto", maxWidth:"100px", objectFit:"contain", filter:"brightness(0)"}} />
              </div>
            ))}
          </div>
        </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-33.33%)}}`}</style>

      <section className="bg-[#111] border-y border-white/10 grid grid-cols-2 md:grid-cols-4">
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-6 text-center font-black text-sm border-r border-white/5 last:border-0"><span className="text-[#E10600]">✓</span> {t}</div>)}
      </section>

      <section className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-10">
        <div><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-[#E10600]">HISTORIA</span></h2><p className="mt-6 text-white/70 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo.</p></div>
        <div className="bg-[#111] p-2 skew-x-[-12deg]"><div className="skew-x- bg-[url('/taller/2.jpg')] h-80 bg-cover"/></div>
      </section>

      <section className="bg-white text-black px-6 md:px-24 py-20">
        <h2 className="text-5xl font-black italic">SERVICIOS</h2>
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {[{n:"Repro Stage 1/2",p:"Desde $180.000"},{n:"Scanner Multimarca",p:"Desde $25.000"},{n:"Alineación 3D",p:"Desde $18.000"},{n:"Balanceo",p:"Desde $12.000"},{n:"Ajuste Motor",p:"Cotizar"},{n:"Mecánica General",p:"Cotizar"}].map(s=><div key={s.n} className="border-2 border-black p-6 hover:bg-black hover:text-white transition"><div className="font-black text-xl">{s.n}</div><div className="mt-2 text-[#E10600] font-bold">{s.p}</div><button className="mt-4 bg-[#E10600] text-white px-4 py-2 text-sm font-black">COTIZAR</button></div>)}
        </div>
      </section>

      <footer className="bg-black border-t border-[#E10600] py-10 text-center text-white/50">balladares-motors.cl - Concepción, Chile - 2026</footer>
      <a href="https://wa.me/56932285399" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-xl">W</a>
    </main>
  );
}
