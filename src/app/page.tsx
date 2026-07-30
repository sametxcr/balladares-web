"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "https://wa.me/56912345678?text=Hola%20Balladares%20Motors,%20quiero%20cotizar%20"; // <-- CAMBIA TU NUMERO AQUI

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca para todas las marcas", img: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores", img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?q=80&w=2073" },
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setI(p=>(p+1)%slides.length),4000);return()=>clearInterval(t)},[]);
  return (
    <main className="bg-black text-white">
      <nav className="fixed top-0 w-full z-50 bg-black/95 border-b border-[#E10600] flex justify-between items-center px-6 py-2">
        <div className="flex items-center gap-3">
          {/* LOGO REAL */}
          <img src="/logo-principal.png" alt="Balladares Motors" className="h-10 md:h-12 w-auto object-contain" />
        </div>
        <div className="hidden md:flex gap-6 text-sm font-bold">
          <a href="#inicio" className="hover:text-[#E10600]">INICIO</a>
          <a href="#nosotros" className="hover:text-[#E10600]">NOSOTROS</a>
          <a href="#servicios" className="hover:text-[#E10600]">SERVICIOS</a>
          <a href="#contacto" className="hover:text-[#E10600]">CONTACTO</a>
        </div>
        <a href={WHATSAPP} target="_blank" className="bg-[#E10600] px-6 py-2 font-black skew-x-[-12deg]"><span className="skew-x- block">COTIZAR</span></a>
      </nav>

      <section className="h- relative overflow-hidden mt-">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-all duration-700 ${idx===i? "opacity-100 translate-x-0" : "opacity-0 translate-x-10 pointer-events-none"}`} style={{backgroundImage:`url(${s.img})`,backgroundSize:"cover",backgroundPosition:"center"}}>
            <div className="absolute inset-0 bg-black/70"/>
            <div className="relative h-full flex flex-col justify-center px-10 md:px-24">
              <h1 className="text-5xl md:text-8xl font-black italic leading-none max-w-4xl drop-shadow-xl">{s.title}</h1>
              <p className="mt-4 text-xl bg-white text-black inline-block px-4 py-1 font-bold w-fit skew-x-[-12deg]"><span className="skew-x- block">{s.sub}</span></p>
              <a href="#servicios" className="mt-8 w-fit bg-[#E10600] px-8 py-3 font-black skew-x-[-12deg]"><span className="skew-x- block">VER SERVICIOS →</span></a>
            </div>
          </div>
        ))}
      </section>

      {/* WHATSAPP FLOTANTE REAL */}
      <a href={WHATSAPP} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black shadow-2xl z-50 hover:scale-110 transition">W</a>
    </main>
  );
}