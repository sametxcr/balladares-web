"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "56900000000";

const slides = [
  { title: "REPRO STAGE 1 & 2", img: "/hero/repro.jpg", pos: "50% 50%" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", img: "/hero/scanner.jpg", pos: "50% 50%" },
  { title: "SERVICIO DE PISTA Y CALLE", img: "/hero/pista.jpg", pos: "50% 78%" },
];

const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000", d: "Potencia +25% / Torque +30%", icon: "⚡", accent: "from-red-600 to-orange-500" },
  { n: "Scanner Multimarca", p: "Desde $25.000", d: "Diagnóstico computarizado full", icon: "💻", accent: "from-blue-600 to-cyan-400" },
  { n: "Alineación 3D", p: "Desde $18.000", d: "Precisión milimétrica láser", icon: "🎯", accent: "from-zinc-700 to-zinc-500" },
  { n: "Balanceo", p: "Desde $12.000", d: "Vibración cero a alta velocidad", icon: "⚖️", accent: "from-yellow-500 to-amber-500" },
  { n: "Ajuste Motor", p: "Cotizar", d: "Rectificación y armado pro", icon: "🔧", accent: "from-red-600 to-red-800" },
  { n: "Mecánica General", p: "Cotizar", d: "Frenos, suspensión, distribución", icon: "🏁", accent: "from-white to-zinc-400" },
];

const galeria = [
  "/hero/repro.jpg",
  "/hero/scanner.jpg",
  "/hero/pista.jpg",
  "/hero/entrada.jpg",
];

const marcas = ["NISSAN", "TOYOTA", "SUBARU", "MITSUBISHI", "BMW", "AUDI", "CHEVROLET", "FORD"];

export default function Page(){
  const [i,setI]=useState(0);
  const [form,setForm]=useState({marca:"", modelo:"", ano:"", servicio:"Repro Stage 1/2"});
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),4500); return()=>clearInterval(t) },[]);

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Balladares Motors! Quiero cotizar:\nMarca: ${form.marca}\nModelo: ${form.modelo}\nAño: ${form.ano}\nServicio: ${form.servicio}`)}`;

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* NAV - NO TOCAR */}
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
          <a href="#galeria" className="hover:text-red-500">GALERÍA</a>
          <a href="#contacto" className="hover:text-red-500">CONTACTO</a>
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-red-600 px-6 py-2 font-black" style={{transform:"skewX(-12deg)"}}>
          <span style={{transform:"skewX(12deg)", display:"block"}}>COTIZAR</span>
        </a>
      </nav>

      {/* HERO - NO TOCAR - QUEDO PERFECTO */}
      <section id="inicio" className="h-[85vh] relative overflow-hidden mt-[56px] bg-zinc-900">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`}>
            <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: s.pos}} />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative h-full flex flex-col justify-center px-6 md:px-24">
              <h1 className="text-5xl md:text-8xl font-black italic leading-none max-w-4xl">{s.title}</h1>
              <a href="#servicios" className="mt-8 w-fit bg-red-600 px-8 py-3 font-black hover:bg-white hover:text-black transition" style={{transform:"skewX(-12deg)"}}>
                <span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span>
              </a>
            </div>
          </div>
        ))}
        <div className="absolute bottom-8 left-10 flex gap-2">
          {slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 w-12 transition-all ${idx===i?"bg-red-600":"bg-white/30"}`} />)}
        </div>
      </section>

      <section className="bg-[#111] border-y border-white/10 grid grid-cols-2 md:grid-cols-4">
        {["+15 AÑOS EXPERIENCIA","SCANNER ÚLTIMA GEN","TODAS LAS MARCAS","SERVICIO DE PISTA"].map(t=><div key={t} className="p-5 text-center font-black text-sm border-r border-white/5 last:border-0"><span className="text-red-600">✓</span> {t}</div>)}
      </section>

      <section id="nosotros" className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-red-600">HISTORIA</span></h2>
          <p className="mt-6 text-white/60 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo.</p>
          <ul className="mt-8 space-y-3">{["Scanner multimarca","Elevadores profesionales","Alineación y balanceo","Repro Stage 1 y 2"].map(x=><li key={x} className="flex gap-3 font-bold"><span className="text-red-600">■</span>{x}</li>)}</ul>
        </div>
        <div className="bg-zinc-900 p-2 border border-white/10" style={{transform:"skewX(-6deg)"}}>
          <div style={{transform:"skewX(6deg)"}}>
            <img src="/hero/entrada.jpg" alt="taller" className="h-[400px] w-full object-cover" />
          </div>
        </div>
      </section>

      {/* SERVICIOS - NUEVO ESTILO RACING */}
      <section id="servicios" className="bg-white text-black px-6 md:px-24 py-20">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="text-5xl font-black italic leading-none">SERVICIOS <span className="text-red-600">RACING</span></h2>
          <p className="font-bold text-zinc-500 max-w-md">Potencia, precisión y pega garantizada. Estilo taller de pista, sin cuentos.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-12">
          {servicios.map(s=>(
            <div key={s.n} className="group relative">
              {/* marco racing inclinado */}
              <div className="absolute -inset-[1px] bg-black group-hover:bg-red-600 transition-all" style={{transform:"skewX(-4deg)"}} />
              <div className="relative bg-white p-[2px]" style={{transform:"skewX(-4deg)"}}>
                <div className="bg-white p-6" style={{transform:"skewX(4deg)"}}>
                  {/* top accent */}
                  <div className={`h-1 w-full bg-gradient-to-r ${s.accent} mb-4`} />
                  {/* icono 3D */}
                  <div className="flex items-start justify-between">
                    <div className="w-14 h-14 bg-black text-white flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_#dc2626] group-hover:shadow-[6px_6px_0px_#dc2626] transition-all" style={{transform:"rotate(-2deg)"}}>
                      {s.icon}
                    </div>
                    <span className="text-[10px] font-black tracking-[0.2em] bg-black text-white px-2 py-1">PRO</span>
                  </div>
                  <div className="font-black text-xl mt-4 italic">{s.n.toUpperCase()}</div>
                  <div className="text-xs font-bold text-zinc-500 mt-1">{s.d}</div>
                  <div className="mt-3 text-red-600 font-black text-sm">{s.p}</div>
                  <a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" className="mt-5 inline-flex items-center gap-2 bg-black text-white px-5 py-2 text-sm font-black group-hover:bg-red-600 transition">
                    COTIZAR <span className="group-hover:translate-x-1 transition">→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" className="bg-[#0a0a0a] px-6 md:px-24 py-20 border-y border-white/10">
        <h2 className="text-4xl font-black italic">GALERÍA / <span className="text-red-600">PEGA REAL</span></h2>
        <div className="grid md:grid-cols-4 gap-4 mt-8">
          {galeria.map((src, idx)=>(
            <div key={idx} className="group relative overflow-hidden border border-white/10 bg-zinc-900" style={{transform: idx%2===1 ? "skewX(-2deg)" : "skewX(0deg)"}}>
              <div style={{transform: idx%2===1 ? "skewX(2deg)" : "none"}}>
                <img src={src} alt="taller" className="h-[280px] w-full object-cover group-hover:scale-110 transition duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition" />
                <div className="absolute bottom-3 left-3 bg-red-600 px-2 py-1 text-[10px] font-black italic">BALLADARES</div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-4 font-bold">* Fotos reales del taller. Sube más a /public/hero/ para que aparezcan aquí.</p>
      </section>

      {/* MARCAS */}
      <section className="bg-black border-b border-white/10 py-10 px-6 md:px-24 overflow-hidden">
        <div className="flex gap-12 animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          {[...marcas, ...marcas].map((m, i)=>(
            <span key={i} className="font-black italic text-2xl text-white/20 hover:text-white/60 transition">{m}</span>
          ))}
        </div>
      </section>

      {/* CONTACTO + MAPA + FORM */}
      <section id="contacto" className="grid md:grid-cols-2">
        <div className="bg-zinc-900 p-10 md:p-16">
          <h2 className="text-4xl font-black italic">COTIZA EN <span className="text-red-600">30 SEG</span></h2>
          <div className="grid grid-cols-2 gap-4 mt-8">
            <input value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} placeholder="Marca (Nissan)" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600" />
            <input value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} placeholder="Modelo (GT-R)" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600" />
            <input value={form.ano} onChange={e=>setForm({...form, ano:e.target.value})} placeholder="Año (2002)" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600" />
            <select value={form.servicio} onChange={e=>setForm({...form, servicio:e.target.value})} className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600">
              {servicios.map(s=><option key={s.n}>{s.n}</option>)}
            </select>
          </div>
          <a href={waLink} target="_blank" className="mt-6 inline-flex w-full justify-center bg-[#25D366] text-black font-black py-4 hover:bg-white transition">ENVIAR POR WHATSAPP →</a>
          
          <div className="mt-10 space-y-3 text-sm">
            <div className="flex gap-3"><span className="text-red-600 font-black">DIR:</span> <span className="text-white/70">Concepción, Bío Bío - a pasos de Paicaví</span></div>
            <div className="flex gap-3"><span className="text-red-600 font-black">HOR:</span> <span className="text-white/70">Lun - Sáb 09:00 a 19:00</span></div>
            <div className="flex gap-3"><span className="text-red-600 font-black">TEL:</span> <span className="text-white/70">+56 9 0000 0000</span></div>
          </div>
        </div>
        <div className="relative bg-[#111] min-h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.8!2d-73.05!3d-36.82!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sConcepci%C3%B3n%2C%20Chile!5e0!3m2!1ses!2scl!4v1"
            className="absolute inset-0 w-full h-full border-0 grayscale invert"
            loading="lazy"
          />
          <div className="absolute bottom-6 left-6 bg-black border-2 border-red-600 p-4 font-black italic" style={{transform:"skewX(-6deg)"}}>
            <div style={{transform:"skewX(6deg)"}}>
              <div className="text-red-600 text-xs">ENCUÉNTRANOS</div>
              <div className="text-lg">BALLADARES MOTORS</div>
              <div className="text-xs text-white/60">Concepción, Chile</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t-2 border-red-600 py-10 text-center text-white/30 text-xs font-bold tracking-widest">BALLADARES-MOTORS.CL © 2026 - HECHO PARA PISTA Y CALLE</footer>

      <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="fixed bottom-6 right-6 bg-[#25D366] w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black shadow-xl hover:scale-110 transition">W</a>
    </main>
  );
}

