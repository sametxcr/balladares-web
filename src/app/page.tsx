"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "56900000000";

const slides = [
  { title: "REPRO STAGE 1 & 2", img: "/hero/repro.jpg", pos: "50% 40%", scale: 0.85 },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", img: "/hero/scanner.jpg", pos: "50% 50%", scale: 0.85 },
  { title: "SERVICIO DE PISTA Y CALLE", img: "/hero/pista.jpg", pos: "50% 15%", scale: 0.65 },
];

const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000" },
  { n: "Scanner Multimarca", p: "Desde $25.000" },
  { n: "Alineación 3D", p: "Desde $18.000" },
  { n: "Balanceo", p: "Desde $12.000" },
  { n: "Ajuste Motor", p: "Cotizar" },
  { n: "Mecánica General", p: "Cotizar" },
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),4500); return()=>clearInterval(t) },[]);

  return (
    <main className="bg-black text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-black border-b-2 border-red-600 flex justify-between items-center px-6 py-3">
        <div className="font-black text-xl italic tracking-wider flex items-center">
          <span>BALLADARES</span>
          <span className="bg-red-600 px-3 ml-2" style={{transform:"skewX(-12deg)", display:"inline-block"}}>
            <span style={{transform:"skewX(12deg)", display:"inline-block"}}>MOTORS</span>
          </span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold">
          <a href="#inicio" className="hover:text-red-500">INICIO</a>
          <a href="#nosotros" className="hover:text-red-500">NOSOTROS</a>
          <a href="#servicios" className="hover:text-red-500">SERVICIOS</a>
          <a href="#contacto" className="hover:text-red-500">CONTACTO</a>
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-red-600 px-6 py-2 font-black" style={{transform:"skewX(-12deg)"}}>
          <span style={{transform:"skewX(12deg)", display:"block"}}>COTIZAR</span>
        </a>
      </nav>

      <section id="inicio" style={{height:"85vh", marginTop:56, position:"relative", overflow:"hidden", background:"#0a0a0a"}}>
        {slides.map((s,idx)=>(
          <div key={idx} style={{position:"absolute", inset:0, opacity: idx===i?1:0, transition:"opacity 1s"}}>
            <img 
              src={s.img} 
              alt={s.title} 
              style={{
                position:"absolute", inset:0, width:"100%", height:"100%",
                objectFit:"cover",
                objectPosition: s.pos,
                transform: `scale(${s.scale})`,
                transformOrigin:"center center"
              }} 
            />
            <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.6)"}} />
            <div style={{position:"relative", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 80px"}}>
              <h1 style={{fontSize:"80px", fontWeight:900, fontStyle:"italic", lineHeight:0.9, maxWidth:750}}>{s.title}</h1>
              <a href="#servicios" style={{marginTop:32, width:"fit-content", background:"#dc2626", padding:"14px 36px", fontWeight:900, transform:"skewX(-12deg)", display:"inline-block", textDecoration:"none", color:"white"}}>
                <span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span>
              </a>
            </div>
          </div>
        ))}
        <div style={{position:"absolute", bottom:20, left:40, display:"flex", gap:8}}>
          {slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} style={{height:4, width:40, background: idx===i?"#dc2626":"rgba(255,255,255,0.3)", border:0}} />)}
        </div>
      </section>

      <section style={{background:"#111", borderTop:"1px solid rgba(255,255,255,0.1)", borderBottom:"1px solid rgba(255,255,255,0.1)", display:"grid", gridTemplateColumns:"repeat(4,1fr)"}}>
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} style={{padding:20, textAlign:"center", fontWeight:900, fontSize:14, borderRight:"1px solid rgba(255,255,255,0.05)"}}><span style={{color:"#dc2626"}}>✓</span> {t}</div>)}
      </section>

      <section id="nosotros" style={{padding:"80px 96px", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center"}}>
        <div>
          <h2 style={{fontSize:36, fontWeight:900, fontStyle:"italic"}}>NOSOTROS / <span style={{color:"#dc2626"}}>HISTORIA</span></h2>
          <p style={{marginTop:24, color:"rgba(255,255,255,0.6)", lineHeight:1.6}}>Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo.</p>
          <ul style={{marginTop:32, listStyle:"none", padding:0}}>{["Scanner multimarca","Elevadores profesionales","Alineación y balanceo","Repro Stage 1 y 2"].map(x=><li key={x} style={{display:"flex", gap:12, fontWeight:700, marginBottom:8}}><span style={{color:"#dc2626"}}>■</span>{x}</li>)}</ul>
        </div>
        <div style={{background:"#18181b", padding:8, border:"1px solid rgba(255,255,255,0.1)", transform:"skewX(-6deg)"}}>
          <div style={{transform:"skewX(6deg)"}}>
            <img src="/hero/entrada.jpg" alt="frente taller" style={{height:400, width:"100%", objectFit:"cover", objectPosition:"50% 35%"}} />
          </div>
        </div>
      </section>

      <section id="servicios" style={{background:"white", color:"black", padding:"80px 96px"}}>
        <h2 style={{fontSize:48, fontWeight:900, fontStyle:"italic"}}>SERVICIOS</h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:24, marginTop:40}}>
          {servicios.map(s=><div key={s.n} style={{border:"2px solid black", padding:24}}>
            <div style={{fontWeight:900, fontSize:20}}>{s.n}</div>
            <div style={{marginTop:8, color:"#dc2626", fontWeight:700}}>{s.p}</div>
            <a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" style={{marginTop:20, display:"inline-block", background:"#dc2626", color:"white", padding:"8px 20px", fontSize:14, fontWeight:900, textDecoration:"none"}}>COTIZAR</a>
          </div>)}
        </div>
      </section>

      <footer id="contacto" style={{background:"black", borderTop:"2px solid #dc2626", padding:"40px", textAlign:"center", color:"rgba(255,255,255,0.5)", fontSize:14}}>balladares-motors.cl - Concepción, Chile - 2026</footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" style={{position:"fixed", bottom:24, right:24, background:"#25D366", width:56, height:56, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:900, textDecoration:"none", color:"white"}}>W</a>
    </main>
  );
}

