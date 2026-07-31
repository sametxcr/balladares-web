"use client";
import { useState, useEffect } from "react";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real para tu motor", img: "/hero/repro.jpg" },
  { title: "DIAGNÓSTICO", sub: "Scanner multimarca", img: "/hero/scanner.jpg" },
  { title: "PISTA Y CALLE", sub: "Alineación 3D, balanceo", img: "/hero/pista.jpg" },
];

export default function Page(){
  const [i,setI]=useState(0);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%3),4000); return()=>clearInterval(t)},[]);

  return (
    <main style={{background:"black", color:"white"}}>
      <nav style={{position:"fixed", top:0, width:"100%", zIndex:50, background:"black", borderBottom:"2px solid red", display:"flex", justifyContent:"space-between", padding:"12px 24px"}}>
        <div style={{fontWeight:900, fontStyle:"italic"}}>BALLADARES <span style={{background:"red", padding:"2px 8px"}}>MOTORS</span></div>
        <div style={{display:"flex", gap:20, fontWeight:700}}><span>INICIO</span><span>NOSOTROS</span><span>SERVICIOS</span></div>
      </nav>

      <section style={{height:"85vh", marginTop:56, position:"relative", overflow:"hidden"}}>
        {slides.map((s, idx) => (
          <div key={idx} style={{position:"absolute", inset:0, opacity: idx===i?1:0, transition:"opacity 1s", display: idx===i?"block":"none"}}>
            <img src={s.img} alt={s.title} style={{position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover"}} />
            <div style={{position:"absolute", inset:0, background:"rgba(0,0,0,0.6)"}} />
            <div style={{position:"relative", height:"100%", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 80px"}}>
              <h1 style={{fontSize:80, fontWeight:900, fontStyle:"italic", lineHeight:0.9, maxWidth:700}}>{s.title}</h1>
              <p style={{marginTop:16, background:"white", color:"black", display:"inline-block", padding:"6px 16px", fontWeight:700, width:"fit-content"}}>{s.sub}</p>
            </div>
          </div>
        ))}
        <div style={{position:"absolute", bottom:20, left:40, display:"flex", gap:8}}>
          {slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} style={{height:4, width:40, background: idx===i?"red":"rgba(255,255,255,0.3)", border:0}} />)}
        </div>
      </section>

      <section style={{padding:40, textAlign:"center"}}>Si ves las 3 fotos rotando aquí arriba, ya quedó. Si ves negro, es que las fotos no están en /public/hero/</section>
    </main>
  )
}