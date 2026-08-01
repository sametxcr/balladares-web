"use client";
import { useState, useEffect } from "react";

const WHATSAPP = "56932285399";
const INSTAGRAM = "https://www.instagram.com/balladaresmotor/";

const slides = [
  { title: "REPRO STAGE 1 & 2", sub: "Potencia real +25% torque +30%", img: "/hero/repro.jpg", pos: "50% 50%" },
  { title: "DIAGNÓSTICO DE ÚLTIMA GENERACIÓN", sub: "Scanner multimarca - Todas las marcas", img: "/hero/scanner.jpg", pos: "50% 50%" },
  { title: "SERVICIO DE PISTA Y CALLE", sub: "Alineación 3D, balanceo, elevadores pro", img: "/hero/pista.jpg", pos: "50% 82%" },
];

const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000", d: "Libera el verdadero potencial oculto de tu ECU. Ganancia real de +25% HP y +30% torque sin comprometer fiabilidad. Mapeos a medida para calle y pista.", icon: "/icons/turbochip_isometric_icon.webp", accent: "from-red-600 to-orange-500", badge: "POPULAR" },
  { n: "Scanner Multimarca", p: "Desde $25.000", d: "Diagnóstico profundo con equipamiento de última generación. Lectura de fallas, datos en vivo y reseteo de servicios para todas las marcas europeas, japonesas y americanas.", icon: "/icons/obd2_scanner_icon.webp", accent: "from-blue-600 to-cyan-400", badge: "DIAGNOSIS" },
  { n: "Alineación 3D", p: "Desde $18.000", d: "Precisión milimétrica con sistema láser 3D. Corrige desgaste irregular, mejora agarre en curva y devuelve la estabilidad a alta velocidad. Setup de pista disponible.", icon: "/icons/wheel_alignment_icon.webp", accent: "from-zinc-600 to-zinc-400", badge: "LASER" },
  { n: "Balanceo", p: "Desde $12.000", d: "Adiós vibraciones. Balanceo dinámico computarizado para llantas hasta aro 22. Ideal para autos preparados que superan los 200 km/h sin drama.", icon: "/icons/racing_wheel_balancer_icon.webp", accent: "from-yellow-500 to-amber-500", badge: "0 VIBRACIÓN" },
  { n: "Ajuste Motor", p: "Cotizar", d: "Armado y rectificación de motores de alto rendimiento. Desde empaquetaduras a forjado completo. Experiencia en pista, no aprendemos con tu auto.", icon: "/icons/balladares_motors_emblem_transparent.webp", accent: "from-red-600 to-red-800", badge: "FORJADO" },
  { n: "Mecánica General", p: "Cotizar", d: "Frenos, suspensión, distribución, embrague y tren delantero. Especialistas en Nissan SR20 NEO VVL, con tapa de válvulas personalizada Balladares Motors.", icon: "/icons/sr20_neo_vvl_balladares.webp", accent: "from-zinc-700 to-zinc-500", badge: "SR20 VVL" },
  { n: "Venta Etanol / Metanol R117", p: "Cotizar", d: "Combustible de competición E85+ R117 de Balladares Motors. Alto octanaje, menor temperatura y máxima potencia. Racing use only. Bidón 5L.", icon: "/icons/racing_fuel_canister_icon.webp", accent: "from-orange-600 to-red-600", badge: "RACING FUEL", highlight: true },
];

const galeriaTaller = Array.from({ length: 35 }, (_, i) => `/taller/${i + 1}.jpg`);

const features = [
  { t: "+15 AÑOS EXPERIENCIA", icon: "🏆", desc: "Pura pista y calle" },
  { t: "SCANNER ÚLTIMA GEN", icon: "🖥️", desc: "Diagnóstico real" },
  { t: "TODAS LAS MARCAS", icon: "🚗", desc: "Japo, Euro, USA" },
  { t: "SERVICIO DE PISTA", icon: "🏁", desc: "Set-up competición" },
];

const marcas = [
  { name: "NISSAN", logo: "https://cdn.simpleicons.org/nissan" },
  { name: "TOYOTA", logo: "https://cdn.simpleicons.org/toyota" },
  { name: "SUBARU", logo: "https://cdn.simpleicons.org/subaru" },
  { name: "MITSUBISHI", logo: "https://cdn.simpleicons.org/mitsubishi" },
  { name: "BMW", logo: "https://cdn.simpleicons.org/bmw" },
  { name: "AUDI", logo: "https://cdn.simpleicons.org/audi" },
  { name: "CHEVROLET", logo: "https://cdn.simpleicons.org/chevrolet" },
  { name: "FORD", logo: "https://cdn.simpleicons.org/ford" },
  { name: "HONDA", logo: "https://cdn.simpleicons.org/honda" },
  { name: "MAZDA", logo: "https://cdn.simpleicons.org/mazda" },
  { name: "MERCEDES", logo: "https://cdn.simpleicons.org/mercedes" },
  { name: "VOLKSWAGEN", logo: "https://cdn.simpleicons.org/volkswagen" },
  { name: "HYUNDAI", logo: "https://cdn.simpleicons.org/hyundai" },
  { name: "KIA", logo: "https://cdn.simpleicons.org/kia" },
  { name: "PEUGEOT", logo: "https://cdn.simpleicons.org/peugeot" },
];

export default function Page(){
  const [i,setI]=useState(0);
  const [form,setForm]=useState({marca:"", modelo:"", ano:"", servicio:"Repro Stage 1/2"});
  const [selectedImg,setSelectedImg]=useState<string | null>(null);
  const [showAll,setShowAll]=useState(false);
  const [activeService,setActiveService]=useState<string | null>(null);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),5000); return()=>clearInterval(t) },[]);

  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Balladares Motors! Quiero cotizar:\nMarca: ${form.marca}\nModelo: ${form.modelo}\nAño: ${form.ano}\nServicio: ${form.servicio}`)}`;

  return (
    <main className="bg-black text-white overflow-x-hidden">
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .marquee { animation: marquee 45s linear infinite; }`}</style>

      <nav className="fixed top-0 w-full z-50 bg-black border-b-2 border-red-600 flex justify-between items-center px-4 md:px-6 py-2.5">
        <img src="/BB.png" alt="Balladares Motors" className="h-11 md:h-[52px] w-auto" style={{objectFit:"contain", transform:"scaleX(1.44) scaleY(1.06)", transformOrigin:"left center"}} />
        <div className="hidden lg:flex gap-3 text-[13px] font-black tracking-wider">
          {[{id:"inicio", label:"INICIO"},{id:"nosotros", label:"NOSOTROS"},{id:"servicios", label:"SERVICIOS"},{id:"galeria", label:"GALERÍA"},{id:"contacto", label:"CONTACTO"}].map(link=>(
            <a key={link.id} href={`#${link.id}`} className="relative px-4 py-2 border border-white/10 hover:border-red-600 hover:bg-red-600/10 transition-all group" style={{transform:"skewX(-12deg)"}}>
              <span className="group-hover:text-red-500 transition" style={{transform:"skewX(12deg)", display:"block"}}>{link.label}</span>
            </a>
          ))}
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-red-600 px-6 md:px-8 py-2.5 font-black text-sm hover:bg-white hover:text-black transition shadow-[3px_3px_0px_white]" style={{transform:"skewX(-12deg)"}}>
          <span style={{transform:"skewX(12deg)", display:"block"}}>COTIZAR →</span>
        </a>
      </nav>

      <section id="inicio" className="h-[92vh] relative overflow-hidden mt-[58px] bg-zinc-900">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`}>
            <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: s.pos}} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
            <div className="relative h-full flex flex-col justify-between px-4 md:px-24 py-10 md:py-20">
              <div className="mt-16 md:mt-28">
                <h1 className="text-[38px] md:text-[84px] font-black italic leading-[0.88] md:leading-[0.92] max-w-5xl tracking-[-0.02em] text-left">
                  {s.title.split(" ").map((word, wi) => (
                    <span key={wi} className="block" style={{marginTop: wi>0 ? "0.08em" : "0"}}>{word}</span>
                  ))}
                </h1>
              </div>
              <div className="flex flex-col gap-3 items-start mb-2">
                <a href="#servicios" className="w-fit bg-red-600 px-8 md:px-10 py-3 md:py-3.5 font-black text-[14px] md:text-[15px] hover:bg-white hover:text-black transition shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{transform:"skewX(-12deg)"}}>
                  <span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span>
                </a>
                <div className="bg-white text-black inline-flex px-5 md:px-6 py-2 md:py-2.5 font-black text-[12px] md:text-[13px] w-fit shadow-[4px_4px_0px_#dc2626]" style={{transform:"skewX(-12deg)"}}>
                  <span style={{transform:"skewX(12deg)", display:"block"}}>{s.sub}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-2 left-4 md:left-24 flex gap-2">
          {slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 transition-all ${idx===i?"w-12 bg-red-600":"w-8 bg-white/40"}`} />)}
        </div>
      </section>

      <section className="bg-[#0f0f0f] border-y border-white/10 grid grid-cols-2 lg:grid-cols-4">
        {features.map(f=>(
          <div key={f.t} className="group relative p-6 text-center border-r border-white/5 last:border-0 hover:bg-white/[0.02] transition">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-xl shadow-[2px_2px_0px_#dc2626]" style={{transform:"rotate(-3deg)"}}>{f.icon}</div>
              <div className="font-black text-[13px] tracking-wider">{f.t}</div>
              <div className="text-[10px] text-white/40 font-bold tracking-widest">{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* NOSOTROS / HISTORIA - RESTAURADO */}
      <section id="nosotros" className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12 items-center bg-black border-b border-white/5">
        <div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_white]" style={{transform:"skewX(-10deg)"}}><span style={{transform:"skewX(10deg)"}}>🏁</span></div>
            <h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-red-600">HISTORIA</span></h2>
          </div>
          <p className="mt-6 text-white/60 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito, atendiendo autos de gama alta y todas las marcas. Contamos con elevadores, máquina de alineación 3D, balanceo y ajuste de motor completo. Más de 15 años dejando autos andando más fuerte y más seguro.</p>
          <ul className="mt-8 space-y-3">
            {[
              {t:"Scanner multimarca - Todas las marcas", i:"💻"},
              {t:"Elevadores profesionales", i:"🏗️"},
              {t:"Alineación 3D y balanceo de precisión", i:"🎯"},
              {t:"Repro Stage 1 y 2 + R117 Racing Fuel", i:"⚡"},
            ].map(x=>(
              <li key={x.t} className="flex gap-3 items-center font-bold"><div className="w-8 h-8 bg-white text-black flex items-center justify-center text-sm" style={{transform:"skewX(-8deg)"}}><span style={{transform:"skewX(8deg)"}}>{x.i}</span></div>{x.t}</li>
            ))}
          </ul>
        </div>
        <div className="bg-zinc-900 p-2 border border-white/10" style={{transform:"skewX(-6deg)"}}>
          <div style={{transform:"skewX(6deg)"}}><img src="/hero/entrada.jpg" alt="taller" className="h-[440px] w-full object-cover" /></div>
        </div>
      </section>

      <section id="servicios" className="bg-white text-black px-4 md:px-24 py-16 md:py-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white flex items-center justify-center text-3xl shadow-[5px_5px_0px_#dc2626]" style={{transform:"skewX(-8deg)"}}><span style={{transform:"skewX(8deg)"}}>🔧</span></div>
          <h2 className="text-4xl md:text-5xl font-black italic leading-none">SERVICIOS <span className="text-red-600">RACING</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {servicios.map(s=>{
            const isActive = activeService === s.n;
            return (
              <div key={s.n} onMouseEnter={()=>setActiveService(s.n)} onMouseLeave={()=>setActiveService(null)} onClick={()=>setActiveService(isActive ? null : s.n)} className="group relative cursor-pointer">
                <div className="absolute -inset-[1px] bg-black group-hover:bg-red-600 transition-all" style={{transform:"skewX(-3deg)"}} />
                <div className="relative bg-white p-[2px]" style={{transform:"skewX(-3deg)"}}>
                  <div className="bg-white" style={{transform:"skewX(3deg)"}}>
                    <div className="relative h-64 md:h-72 bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center overflow-hidden border-b border-black/5">
                      <img src={s.icon} alt={s.n} className="w-[90%] h-[90%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-black text-white text-[10px] font-black tracking-widest px-3 py-1.5">{s.badge}</div>
                      <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${s.accent}`} />
                      <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-all duration-300 ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                        <div className="text-white font-black italic text-lg mb-2">{s.n.toUpperCase()}</div>
                        <div className="text-white/70 text-[13px] leading-relaxed">{s.d}</div>
                        <div className="mt-4 text-red-500 font-black text-sm">{s.p}</div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="font-black text-[18px] italic tracking-tight leading-tight">{s.n.toUpperCase()}</div>
                      <div className="mt-2 text-red-600 font-black text-[13px]">{s.p}</div>
                      <a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" onClick={e=>e.stopPropagation()} className="mt-4 inline-flex w-full justify-center bg-black text-white py-3 text-sm font-black group-hover:bg-red-600 transition">COTIZAR →</a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-[11px] text-zinc-400 mt-6 font-bold tracking-widest">* TOCA EL ICONO PARA VER DETALLE</p>
      </section>

      <section id="galeria" className="bg-[#0a0a0a] px-4 md:px-24 py-16 border-y border-white/10">
        <div className="flex justify-between items-end flex-wrap gap-4">
          <h2 className="text-3xl md:text-4xl font-black italic">GALERÍA / <span className="text-red-600">PEGA REAL ({galeriaTaller.length})</span></h2>
          <button onClick={()=>setShowAll(!showAll)} className="bg-white text-black px-6 py-2 font-black text-sm hover:bg-red-600 hover:text-white transition" style={{transform:"skewX(-10deg)"}}><span style={{transform:"skewX(10deg)", display:"block"}}>{showAll ? "VER MENOS" : `VER ${galeriaTaller.length} →`}</span></button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          {(showAll ? galeriaTaller : galeriaTaller.slice(0,12)).map((src, idx)=>(
            <div key={idx} onClick={()=>setSelectedImg(src)} className="group relative overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer aspect-[4/3]">
              <img src={src} alt={`Taller ${idx+1}`} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" onError={(e)=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}} />
              <div className="absolute bottom-1 left-1 bg-red-600 px-2 py-0.5 text-[8px] font-black italic">BALLADARES</div>
            </div>
          ))}
        </div>
        {selectedImg && (<div onClick={()=>setSelectedImg(null)} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"><img src={selectedImg} alt="full" className="max-w-full max-h-full object-contain" /></div>)}
      </section>

      <section className="bg-black border-y border-white/10 py-6 overflow-hidden">
        <div className="marquee flex w-max items-center">
          {[...marcas, ...marcas].map((m, i)=>(
            <div key={i} className="flex items-center gap-3 mx-7 md:mx-10">
              <img src={m.logo} alt={m.name} className="w-8 h-8 md:w-9 md:h-9 object-contain" />
              <span className="font-black italic text-[14px] md:text-[16px] text-white tracking-wider">{m.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section id="contacto" className="grid md:grid-cols-2">
        <div className="bg-zinc-900 p-8 md:p-16">
          <h2 className="text-3xl md:text-4xl font-black italic">COTIZA EN <span className="text-red-600">30 SEG</span></h2>
          <div className="grid grid-cols-2 gap-3 mt-6">
            <input value={form.marca} onChange={e=>setForm({...form, marca:e.target.value})} placeholder="Marca" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600 text-white" />
            <input value={form.modelo} onChange={e=>setForm({...form, modelo:e.target.value})} placeholder="Modelo" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600 text-white" />
            <input value={form.ano} onChange={e=>setForm({...form, ano:e.target.value})} placeholder="Año" className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600 text-white" />
            <select value={form.servicio} onChange={e=>setForm({...form, servicio:e.target.value})} className="bg-black border border-white/10 p-3 text-sm font-bold outline-none focus:border-red-600 text-white">
              {servicios.map(s=><option key={s.n}>{s.n}</option>)}
            </select>
          </div>
          <a href={waLink} target="_blank" className="mt-5 inline-flex w-full justify-center bg-[#25D366] text-black font-black py-3.5 hover:bg-white transition text-sm">ENVIAR POR WHATSAPP →</a>
          <div className="mt-8 space-y-3 text-sm">
            <div className="flex gap-2"><span className="text-red-600 font-black">DIR:</span> <span className="text-white/80 font-bold">RODOLFO BRICEÑO #2718, CONCEPCIÓN</span></div>
            <div className="flex gap-2"><span className="text-red-600 font-black">TEL:</span> <span className="text-white/70">+56 9 3228 5399</span></div>
          </div>
        </div>
        <div className="relative bg-[#111] min-h-[400px]">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.5!2d-73.06!3d-36.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b5e5d0f0f0f1%3A0x0!2sRodolfo%20Brice%C3%B1o%202718%2C%20Concepci%C3%B3n%2C%20Chile!5e0!3m2!1ses!2scl!4v1" className="absolute inset-0 w-full h-full border-0 grayscale" loading="lazy" />
        </div>
      </section>

      <footer className="bg-black border-t-2 border-red-600 py-8 text-center text-white/30 text-xs font-bold tracking-widest">BALLADARES-MOTORS.CL © 2026 - RODOLFO BRICEÑO #2718, CONCEPCIÓN</footer>

      <div className="fixed bottom-5 right-5 flex gap-3 z-50">
        <a href={INSTAGRAM} target="_blank" className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
        </a>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition bg-[#25D366]">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.55 4.104 1.516 5.823L0 24l6.35-1.66A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.785 0-3.46-.487-4.9-1.334l-.35-.208-3.772.988.998-3.674-.23-.374A9.92 9.92 0 012 12c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10zm5.405-7.473c-.296-.149-1.75-.864-2.022-.963-.272-.099-.47-.149-.668.149-.198.297-.767.963-.94 1.161-.173.198-.347.223-.644.074-.296-.149-1.251-.461-2.383-1.47-.881-.785-1.476-1.75-1.65-2.047-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.149-.173.198-.297.297-.495.099-.198.05-.371-.025-.521-.074-.148-.668-1.609-.915-2.203-.241-.58-.486-.502-.668-.512l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.478 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.71.306 1.263.49 1.695.627.712.226 1.36.194 1.872.118.571-.085 1.75-.715 1.997-1.406.247-.691.247-1.283.173-1.406-.074-.124-.272-.198-.57-.347z"/></svg>
        </a>
      </div>
    </main>
  );
}

