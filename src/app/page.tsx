"use client";
import { useState, useEffect } from "react";
const WHATSAPP = "56932285399";
const INSTAGRAM = "https://www.instagram.com/balladaresmotor/";
const YOUTUBE_ID = "0q6KurtImDI";
const slides = [
  { title: ["repro stage", "1 & 2"], titleImgs: ["/hero/titles/repro_stage_transparent.png", "/hero/titles/1and2_transparent.png"], sub: "Potencia real +25% torque +30%", img: "/hero/repro.jpg", pos: "50% 50%" },
  { title: ["servicios de", "pista y calle"], titleImgs: ["/hero/titles/servicios_de_transparent.png", "/hero/titles/pista_y_calle_transparent.png"], sub: "Alineación 3D, balanceo, elevadores pro", img: "/hero/pista.jpg", pos: "50% 82%" },
  { title: ["diagnostico de", "ultima generacion"], titleImgs: ["/hero/titles/diagnostico_de_transparent.png", "/hero/titles/ultima_generacion_transparent.png"], sub: "Scanner multimarca - Todas las marcas", img: "/hero/scanner.jpg", pos: "50% 50%" },
];
const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000", d: "Libera el verdadero potencial oculto de tu ECU. +25% HP y +30% torque.", icon: "/icons/turbochip_isometric_icon.webp", accent: "from-red-600 to-orange-500", badge: "POPULAR" },
  { n: "Scanner Multimarca", p: "Desde $25.000", d: "Diagnóstico profundo con equipamiento de última generación.", icon: "/icons/obd2_scanner_icon.webp", accent: "from-blue-600 to-cyan-400", badge: "DIAGNOSIS" },
  { n: "Alineación 3D", p: "Desde $18.000", d: "Precisión milimétrica con sistema láser 3D.", icon: "/icons/wheel_alignment_icon.webp", accent: "from-zinc-600 to-zinc-400", badge: "LASER" },
  { n: "Balanceo", p: "Desde $12.000", d: "Adiós vibraciones. Balanceo dinámico computarizado.", icon: "/icons/racing_wheel_balancer_icon.webp", accent: "from-yellow-500 to-amber-500", badge: "0 VIBRACIÓN" },
  { n: "Ajuste Motor", p: "Cotizar", d: "Armado y rectificación de motores de alto rendimiento.", icon: "/icons/balladares_motors_emblem_transparent.webp", accent: "from-red-600 to-red-800", badge: "AJUSTE" },
  { n: "Mecánica General", p: "Cotizar", d: "Frenos, suspensión, distribución. Especialistas en SR20 NEO VVL.", icon: "/icons/sr20_neo_vvl_balladares.webp", accent: "from-zinc-700 to-zinc-500", badge: "MECANICA GENERAL" },
  { n: "Venta Etanol / Metanol R117", p: "Cotizar", d: "Combustible de competición E85+ R117.", icon: "/icons/racing_fuel_canister_icon.webp", accent: "from-orange-600 to-red-600", badge: "RACING FUEL" },
];
const galeriaTaller = Array.from({ length: 35 }, (_, i) => `/taller/${i + 1}.jpg`);
const marcas = [
  { name: "NISSAN", logo: "/brands/brand_nissan_3d.png" },
  { name: "TOYOTA", logo: "/brands/brand_toyota_3d.png" },
  { name: "SUBARU", logo: "/brands/brand_subaru_3d.png" },
  { name: "MITSUBISHI", logo: "/brands/brand_mitsubishi_3d.png" },
  { name: "BMW", logo: "/brands/brand_bmw_3d.png" },
  { name: "AUDI", logo: "/brands/brand_audi_3d.png" },
  { name: "CHEVROLET", logo: "/brands/brand_chevrolet_3d.png" },
  { name: "FORD", logo: "/brands/brand_ford_3d.png" },
  { name: "HONDA", logo: "/brands/brand_honda_3d.png" },
  { name: "MAZDA", logo: "/brands/brand_mazda_3d.png" },
  { name: "MERCEDES", logo: "/brands/brand_mercedes_3d.png" },
  { name: "VOLKSWAGEN", logo: "/brands/brand_volkswagen_3d.png" },
  { name: "HYUNDAI", logo: "/brands/brand_hyundai_3d.png" },
  { name: "KIA", logo: "/brands/brand_kia_3d.png" },
  { name: "PEUGEOT", logo: "/brands/brand_peugeot_3d.png" },
];
export default function Page(){
  const [i,setI]=useState(0);
  const [form,setForm]=useState({marca:"", modelo:"", ano:"", servicio:"Repro Stage 1/2"});
  const [selectedImg,setSelectedImg]=useState<string | null>(null);
  const [showAll,setShowAll]=useState(false);
  const [activeService,setActiveService]=useState<string | null>(null);
  const [showIntro,setShowIntro]=useState(true);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),5000); return()=>clearInterval(t) },[]);
  const waLink = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hola Balladares Motors! Quiero cotizar:\nMarca: ${form.marca}\nModelo: ${form.modelo}\nAño: ${form.ano}\nServicio: ${form.servicio}`)}`;
  return (
    <main className="bg-black text-white overflow-x-hidden">
      {showIntro && (
        <div className="fixed inset-0 z-[200] bg-black flex items-center justify-center">
          <button onClick={()=>setShowIntro(false)} className="absolute top-4 right-4 z-30 w-12 h-12 bg-white/10 hover:bg-red-600 border border-white/20 rounded-full flex items-center justify-center text-white text-xl font-black">✕</button>
          <iframe className="w-full h-full aspect-[9/16] md:aspect-video max-w- md:max-w-full" src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`} title="Intro" allow="autoplay; encrypted-media" allowFullScreen />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"><button onClick={()=>setShowIntro(false)} className="bg-white/10 border border-white/20 text-white px-6 py-2.5 font-black text-sm" style={{transform:"skewX(-12deg)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>SALTAR INTRO →</span></button></div>
        </div>
      )}
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }.marquee { animation: marquee 60s linear infinite; }`}</style>
      <nav className="fixed top-0 w-full z-50 bg-black border-b-2 border-red-600 flex justify-between items-center px-4 md:px-6 py-2.5">
        <img src="/BB.png" alt="Balladares Motors" className="h-11 md:h- w-auto" style={{objectFit:"contain", transform:"scaleX(1.44) scaleY(1.06)", transformOrigin:"left center"}} />
        <div className="hidden lg:flex gap-3 text- font-black tracking-wider">
          {[{id:"inicio", label:"INICIO"},{id:"nosotros", label:"NOSOTROS"},{id:"servicios", label:"SERVICIOS"},{id:"galeria", label:"GALERÍA"},{id:"contacto", label:"CONTACTO"}].map(link=>(
            <a key={link.id} href={`#${link.id}`} className="relative px-4 py-2 border border-white/10 hover:border-red-600 hover:bg-red-600/10 group" style={{transform:"skewX(-12deg)"}}><span className="group-hover:text-red-500" style={{transform:"skewX(12deg)", display:"block"}}>{link.label}</span></a>
          ))}
        </div>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="bg-red-600 px-6 md:px-8 py-2.5 font-black text-sm shadow-[3px_3px_0px_white]" style={{transform:"skewX(-12deg)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>COTIZAR →</span></a>
      </nav>
      <section id="inicio" className="h- relative overflow-hidden mt- bg-zinc-900">
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`}>
            <img src={s.img} alt={s.title.join(" ")} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: s.pos}} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="relative h-full flex flex-col justify-between px-4 md:px-24 py-10 md:py-20">
              <div className="mt-12 md:mt-20 flex flex-col items-start gap-1">
                {s.titleImgs.map((imgSrc, li) => (
                  <div key={li} className="relative">
                    <img src={imgSrc} alt={s.title[li]} className="h- md:h- w-auto max-w- md:max-w- object-contain drop-shadow-[10px_10px_15px_rgba(0,0,0,1)]" style={{transform: li===1? "translateX(22px)" : "none"}} onError={(e)=>{ const t=e.target as HTMLImageElement; t.style.display='none'; const f=t.nextElementSibling as HTMLElement; if(f) f.classList.remove('hidden'); }} />
                    <div className="hidden text- md:text- font-black italic leading-[0.9] tracking-tighter drop-shadow-[6px_6px_0px_black] uppercase">{s.title[li]}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 items-start mb-2">
                <a href="#servicios" className="w-fit bg-red-600 px-8 md:px-10 py-3 md:py-3.5 font-black text- md:text- hover:bg-white hover:text-black transition shadow-[4px_4px_0px_rgba(0,0,0,0.8)]" style={{transform:"skewX(-12deg)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span></a>
                <div className="bg-white text-black inline-flex px-5 md:px-6 py-2 md:py-2.5 font-black text- md:text- w-fit shadow-[4px_4px_0px_#dc2626]" style={{transform:"skewX(-12deg)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>{s.sub}</span></div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-2 left-4 md:left-24 flex gap-2">{slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 transition-all ${idx===i?"w-12 bg-red-600":"w-8 bg-white/40"}`} />)}</div>
      </section>
      <section className="bg-[#0f0f0f] border-y border-white/10 grid grid-cols-2 lg:grid-cols-4">
        {[{ t: "+15 AÑOS EXPERIENCIA", icon: "🏆", desc: "Pura pista y calle" },{ t: "SCANNER ÚLTIMA GEN", icon: "🖥", desc: "Diagnóstico real" },{ t: "TODAS LAS MARCAS", icon: "🚗", desc: "Japo, Euro, USA" },{ t: "SERVICIO DE PISTA", icon: "🏁", desc: "Set-up competición" },].map(f=><div key={f.t} className="p-6 text-center border-r border-white/5 last:border-0"><div className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-xl shadow-[2px_2px_0px_#dc2626]" style={{transform:"rotate(-3deg)"}}>{f.icon}</div><div className="font-black text-">{f.t}</div><div className="text- text-white/40 font-bold">{f.desc}</div></div></div>)}
      </section>
      <section id="nosotros" className="px-6 md:px-24 py-20 grid md:grid-cols-2 gap-12 items-center bg-black border-b border-white/5">
        <div><div className="flex items-center gap-4"><div className="w-14 h-14 bg-red-600 flex items-center justify-center text-2xl font-black shadow-[4px_4px_0px_white]" style={{transform:"skewX(-10deg)"}}><span style={{transform:"skewX(10deg)"}}>🏁</span></div><h2 className="text-4xl font-black italic">NOSOTROS / <span className="text-red-600">HISTORIA</span></h2></div><p className="mt-6 text-white/60 leading-relaxed">Balladares Motors es un taller bien conocido en Concepción. Nacimos de la pasión por las carreras en pista y circuito.</p></div>
        <div className="bg-zinc-900 p-2 border border-white/10" style={{transform:"skewX(-6deg)"}}><div style={{transform:"skewX(6deg)"}}><img src="/hero/entrada.jpg" alt="taller" className="h- w-full object-cover" /></div></div>
      </section>
      <section id="servicios" className="bg-white text-black px-4 md:px-24 py-16 md:py-20">
        <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white flex items-center justify-center text-3xl shadow-[5px_5px_0px_#dc2626]" style={{transform:"skewX(-8deg)"}}><span style={{transform:"skewX(8deg)"}}>🔧</span></div><h2 className="text-4xl md:text-5xl font-black italic leading-none">SERVICIOS <span className="text-red-600">RACING</span></h2></div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {servicios.map(s=>{
            const isActive = activeService === s.n;
            return (
              <div key={s.n} onMouseEnter={()=>setActiveService(s.n)} onMouseLeave={()=>setActiveService(null)} onClick={()=>setActiveService(isActive? null : s.n)} className="group relative cursor-pointer">
                <div className="absolute -inset- bg-black group-hover:bg-red-600 transition-all" style={{transform:"skewX(-3deg)"}} />
                <div className="relative bg-white p-" style={{transform:"skewX(-3deg)"}}>
                  <div className="bg-white" style={{transform:"skewX(3deg)"}}>
                    <div className="relative h-64 md:h-72 bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center overflow-hidden border-b border-black/5">
                      <img src={s.icon} alt={s.n} className="w-[90%] h-[90%] object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-black text-white text- font-black tracking-widest px-3 py-1.5">{s.badge}</div>
                      <div className={`absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r ${s.accent}`} />
                      <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-all duration-300 ${isActive? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                        <div className="text-white font-black italic text-lg mb-2">{s.n.toUpperCase()}</div>
                        <div className="text-white/70 text- leading-relaxed">{s.d}</div>
                      </div>
                    </div>
                    <div className="p-5"><div className="font-black text- italic tracking-tight leading-tight">{s.n.toUpperCase()}</div><div className="mt-2 text-red-600 font-black text-">{s.p}</div><a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" onClick={e=>e.stopPropagation()} className="mt-4 inline-flex w-full justify-center bg-black text-white py-3 text-sm font-black group-hover:bg-red-600 transition">COTIZAR →</a></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      <section id="galeria" className="bg-[#0a0a0a] px-4 md:px-24 py-16 border-y border-white/10">
        <div className="flex justify-between items-end flex-wrap gap-4"><h2 className="text-3xl md:text-4xl font-black italic">GALERÍA / <span className="text-red-600">PEGA REAL ({galeriaTaller.length})</span></h2><button onClick={()=>setShowAll(!showAll)} className="bg-white text-black px-6 py-2 font-black text-sm hover:bg-red-600 hover:text-white transition" style={{transform:"skewX(-10deg)"}}><span style={{transform:"skewX(10deg)", display:"block"}}>{showAll? "VER MENOS" : `VER ${galeriaTaller.length} →`}</span></button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">{(showAll? galeriaTaller : galeriaTaller.slice(0,12)).map((src, idx)=><div key={idx} onClick={()=>setSelectedImg(src)} className="group relative overflow-hidden border border-white/10 bg-zinc-900 cursor-pointer aspect-[4/3]"><img src={src} alt={`Taller ${idx+1}`} className="h-full w-full object-cover group-hover:scale-110 transition duration-700" onError={(e)=>{(e.target as HTMLImageElement).parentElement!.style.display='none'}} /></div>)}</div>
        {selectedImg && (<div onClick={()=>setSelectedImg(null)} className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"><img src={selectedImg} alt="full" className="max-w-full max-h-full object-contain" /></div>)}
      </section>
      <section className="bg-gradient-to-r from-black via-zinc-900 to-black border-y-2 border-red-600 py-4 md:py-5 overflow-hidden relative">
        <div className="marquee flex w-max items-center">
          {[...marcas,...marcas].map((m, i)=>(
            <div key={i} className="flex items-center gap-3 mx-5 md:mx-6">
              <div className="relative w-12 h-12 md:w-14 md:h-14 rounded- bg-white flex items-center justify-center p-2 shadow-[3px_3px_0px_#dc2626]"><img src={m.logo} alt={m.name} className="w-full h-full object-contain" /></div>
              <span className="font-black italic text- md:text-">{m.name}</span>
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
        </div>
        <div className="relative bg-[#111] min-h-"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.5!2d-73.06!3d-36.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b5e5d0f0f0f1%3A0x0!2sRodolfo%20Brice%C3%B1o%202718%2C%20Concepci%C3%B3n%2C%20Chile!5e0!3m2!1ses!2scl!4v1" className="absolute inset-0 w-full h-full border-0 grayscale" loading="lazy" /></div>
      </section>
      <footer className="bg-black border-t-2 border-red-600 py-8 text-center text-white/30 text-xs font-bold tracking-widest">BALLADARES-MOTORS.CL © 2026</footer>
    </main>
  );
}