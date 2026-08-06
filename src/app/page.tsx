"use client";
import { useState, useEffect } from "react";
import { Montserrat, Holtwood_One_SC } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400","700","900"] });
const holtwood = Holtwood_One_SC({ weight: "400", subsets: ["latin"] });

const WHATSAPP = "56932285399";
const INSTAGRAM = "https://www.instagram.com/balladaresmotor/";
const YOUTUBE_ID = "0q6KurtImDI";

const slides = [
  { title: ["repro stage", "1 & 2"], titleImgs: ["/hero/titles/repro_stage_transparent.png", "/hero/titles/1and2_transparent.png"], sub: "Potencia real +25% torque +30%", img: "/hero/repro.jpg", pos: "50% 50%" },
  { title: ["servicios de", "pista y calle"], titleImgs: ["/hero/titles/servicios_de_transparent.png", "/hero/titles/pista_y_calle_transparent.png"], sub: "Alineación 3D, balanceo, elevadores pro", img: "/hero/pista.jpg", pos: "50% 82%" },
  { title: ["diagnostico de", "ultima generacion"], titleImgs: ["/hero/titles/diagnostico_de_transparent.png", "/hero/titles/ultima_generacion_transparent.png"], sub: "Scanner multimarca - Todas las marcas", img: "/hero/scanner.jpg", pos: "50% 50%" },
];

const servicios = [
  { n: "Repro Stage 1/2", p: "Desde $180.000", d: "Libera el verdadero potencial oculto de tu ECU. Potencia tu auto de forma segura +torque +potencia +economia.", icon: "/icons/turbochip_isometric_icon.webp", accent: "from-red-600 to-orange-500", badge: "POPULAR" },
  { n: "Scanner Multimarca", p: "Desde $25.000", d: "Diagnóstico profundo con equipamiento de última generación. Soporte Tecnico en diferentes marcas.", icon: "/icons/obd2_scanner_icon.webp", accent: "from-blue-600 to-cyan-400", badge: "DIAGNOSIS" },
  { n: "Alineación con Laser + Balanceo", p: "Desde $18.000", d: "Precisión milimétrica con sistema láser 3D. Evita el desgaste excesivo de tus neumaticos y vibraciones al conducir.", icon: "/icons/wheel_alignment_icon.webp", accent: "from-zinc-600 to-zinc-400", badge: "LASER" },  
  { n: "Ajuste Motor", p: "Cotizar", d: "Armado y rectificación de motores de estandar y alto rendimiento. Resultados optimos con el soporte de diferentes maestranzas.", icon: "/icons/balladares_motors_emblem_transparent.webp", accent: "from-red-600 to-red-800", badge: "AJUSTE" },
  { n: "Mecánica General", p: "Cotizar", d: "Encuentra todos los servicios basicos en un solo lugar - mantencion por kilometraje - servicio de diagnostico - reparacion tren delantero - reparacion y mantencion sistema de frenos - afinamiento - cambio aceite y muchos mas cotiza aca.", icon: "/icons/sr20_neo_vvl_balladares.webp", accent: "from-zinc-700 to-zinc-500", badge: "MECANICA GENERAL" },
  { n: "Venta Etanol / Metanol R117", p: "Cotizar", d: "Protege tu motor con combustible de carrera.", icon: "/icons/racing_fuel_canister_icon.webp", accent: "from-orange-600 to-red-600", badge: "RACING FUEL" },
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
        <div className="fixed inset-0 bg-black flex items-center justify-center" style={{zIndex:200}}>
          <button onClick={()=>setShowIntro(false)} className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-red-600 border border-white/20 rounded-full flex items-center justify-center text-white text-xl font-black transition" style={{zIndex:30}}>✕</button>
          <iframe className="w-full h-full" style={{maxWidth:420, aspectRatio:"9/16"}} src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1&playsinline=1`} title="Intro" allow="autoplay; encrypted-media" allowFullScreen />
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2" style={{zIndex:20}}>
            <button onClick={()=>setShowIntro(false)} className="bg-white/10 border border-white/20 text-white px-6 py-2.5 font-black text-sm hover:bg-white hover:text-black transition" style={{transform:"skewX(-12deg)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>SALTAR INTRO →</span></button>
          </div>
        </div>
      )}

      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .marquee { animation: marquee 25s linear infinite; }`}</style>

      <nav className="fixed top-0 w-full bg-black border-b-2 border-red-600 flex justify-between items-center pl-1 pr-4 py-2.5" style={{zIndex:50}}>
  <img src="/BB.png" alt="Balladares Motors" className="h-11 w-auto -ml-2" style={{objectFit:"contain", transform:"scaleX(1.44) scaleY(1.06)", transformOrigin:"left center", height:52}} />
  <div className="hidden lg:flex gap-3 text-sm font-black tracking-wider">
    {[{id:"inicio", label:"INICIO"},{id:"nosotros", label:"NOSOTROS"},{id:"servicios", label:"SERVICIOS"},{id:"galeria", label:"GALERÍA"},{id:"contacto", label:"CONTACTO"}].map(link=>(
      <a key={link.id} href={`#${link.id}`} className="relative px-4 py-2 border border-white/10 hover:border-red-600 hover:bg-red-600/10 group" style={{transform:"skewX(-12deg)"}}><span className="group-hover:text-red-500" style={{transform:"skewX(12deg)", display:"block"}}>{link.label}</span></a>
    ))}
  </div>
  <img src="/LB.png" alt="Lubricentro Balladares" className="h-11 w-auto" style={{objectFit:"contain", height:52}} />
</nav>

      <section id="inicio" className="relative overflow-hidden bg-zinc-900" style={{height:"92vh", marginTop:58}}>
        {slides.map((s,idx)=>(
          <div key={idx} className={`absolute inset-0 transition-opacity duration-1000 ${idx===i?"opacity-100":"opacity-0"}`}>
            <img src={s.img} alt={s.title.join(" ")} className="absolute inset-0 w-full h-full object-cover" style={{objectPosition: s.pos}} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
            <div className="relative h-full flex flex-col justify-between px-4 md:px-24 py-10 md:py-20">
      <div className={`${holtwood.className} mt-12 md:mt-20 flex flex-col items-start gap-4 md:gap-6`}>
  {s.title.map((t, li) => (
    <div key={li} className="racer-wrap" style={{transform: li===1 ? "skewX(-14deg) translateX(18px)" : "skewX(-14deg)"}}>
      <div className="racer-lines"></div>
      <h1 data-text={t.toUpperCase()} className="racer-main text-[2.1rem] md:text-[3.6rem]">
        {t.toUpperCase()}
      </h1>
    </div>
  ))}
</div>
              <div className="flex flex-col gap-3 items-start mb-2">
                <a href="#servicios" className="w-fit bg-red-600 px-10 py-3.5 font-black text-sm hover:bg-white hover:text-black transition" style={{transform:"skewX(-12deg)", boxShadow:"4px 4px 0px rgba(0,0,0,0.8)"}}><span style={{transform:"skewX(12deg)", display:"block"}}>VER SERVICIOS →</span></a>
                <div className="bg-white text-black inline-flex px-6 py-2.5 font-black text-xs w-fit" style={{transform:"skewX(-12deg)", boxShadow:"4px 4px 0px #dc2626"}}><span style={{transform:"skewX(12deg)", display:"block"}}>{s.sub}</span></div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-2 left-4 md:left-24 flex gap-2">{slides.map((_,idx)=><button key={idx} onClick={()=>setI(idx)} className={`h-1 transition-all ${idx===i?"w-12 bg-red-600":"w-8 bg-white/40"}`} />)}</div>
      </section>

      <section className="bg-black border-y border-white/10 grid grid-cols-2 lg:grid-cols-4" style={{backgroundColor:"#0f0f0f"}}>
        {[
          { t: "+15 AÑOS EXPERIENCIA", icon: "🏆", desc: "Pista y calle" },
          { t: "SCANNER ÚLTIMA GEN", icon: "🖥", desc: "Diagnóstico real" },
          { t: "TODAS LAS MARCAS", icon: "🚗", desc: "Japo, Euro, USA" },
          { t: "SERVICIO DE PISTA", icon: "🏁", desc: "Set-up competición" },
        ].map(f=><div key={f.t} className="p-6 text-center border-r border-white/5"><div className="flex flex-col items-center gap-2"><div className="w-12 h-12 bg-gradient-to-br from-zinc-800 to-black border border-white/10 flex items-center justify-center text-xl" style={{boxShadow:"2px 2px 0px #dc2626", transform:"rotate(-3deg)"}}>{f.icon}</div><div className="font-black text-sm">{f.t}</div><div className="text-xs text-white/40 font-bold">{f.desc}</div></div></div>)}
      </section>

     <section id="nosotros" className="bg-black border-b border-white/5 px-4 md:px-24 py-16 md:py-24">
        {/* ESLOGAN EN GRANDE */}
        <div className="mb-12">
          <h2 className={`${holtwood.className} text-4xl md:text-7xl font-black italic leading-[0.9]`}>
            EL PODER DE <span className="text-red-600">UN BUEN SERVICIO</span>
          </h2>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
  <div className="bg-black border border-white/10 aspect-[4/3] overflow-hidden">
    <img src="/entrada.jpg" alt="Entrada 1" className="w-full h-full object-cover" style={{objectPosition:"center center", transform:"scale(0.82)"}} />
  </div>
 <div className="bg-black border border-white/10 aspect-[4/3] overflow-hidden">
  <img src="/entrada2.jpg" alt="Entrada 2" className="w-full h-full object-cover" style={{objectPosition:"50% 18%", transform:"scale(0.90)"}} />
</div>
  <div className="bg-black border border-white/10 aspect-[4/3] overflow-hidden">
    <img src="/entradanoche.jpg" alt="Entrada Noche" className="w-full h-full object-cover" style={{objectPosition:"center center", transform:"scale(0.82)"}} />
  </div>
</div>

      </section>

      <section id="servicios" className="bg-white text-black px-4 md:px-24 py-16 md:py-20">
        <div className="flex items-center gap-4 mb-8"><div className="w-14 h-14 md:w-16 md:h-16 bg-black text-white flex items-center justify-center text-3xl" style={{boxShadow:"5px 5px 0px #dc2626", transform:"skewX(-8deg)"}}><span style={{transform:"skewX(8deg)"}}>🔧</span></div><h2 className="text-4xl md:text-5xl font-black italic leading-none">SERVICIOS <span className="text-red-600">RACING</span></h2></div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {servicios.map(s=>{
            const isActive = activeService === s.n;
            return (
              <div key={s.n} onMouseEnter={()=>setActiveService(s.n)} onMouseLeave={()=>setActiveService(null)} onClick={()=>setActiveService(isActive? null : s.n)} className="group relative cursor-pointer">
                <div className="absolute bg-black group-hover:bg-red-600 transition-all" style={{inset:-1, transform:"skewX(-3deg)"}} />
                <div className="relative bg-white p-0.5" style={{transform:"skewX(-3deg)"}}>
                  <div className="bg-white" style={{transform:"skewX(3deg)"}}>
                    <div className="relative bg-gradient-to-br from-zinc-50 to-zinc-100 flex items-center justify-center overflow-hidden border-b border-black/5" style={{height:280}}>
                      <img src={s.icon} alt={s.n} className="w-11/12 h-11/12 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute top-3 right-3 bg-black text-white text-xs font-black tracking-widest px-3 py-1.5">{s.badge}</div>
                      <div className={`absolute top-0 left-0 w-full bg-gradient-to-r ${s.accent}`} style={{height:6}} />
                      <div className={`absolute inset-0 bg-black/90 p-6 flex flex-col justify-center transition-all duration-300 ${isActive? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                        <div className="text-white font-black italic text-lg mb-2">{s.n.toUpperCase()}</div>
                        <div className="text-white/70 text-sm leading-relaxed">{s.d}</div>
                      </div>
                    </div>
                    <div className="p-5"><div className="font-black text-lg italic tracking-tight leading-tight">{s.n.toUpperCase()}</div><div className="mt-2 text-red-600 font-black text-sm">{s.p}</div><a href={`https://wa.me/${WHATSAPP}?text=Hola, quiero cotizar ${encodeURIComponent(s.n)}`} target="_blank" onClick={e=>e.stopPropagation()} className="mt-4 inline-flex w-full justify-center bg-black text-white py-3 text-sm font-black group-hover:bg-red-600 transition">COTIZAR →</a></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

 {/* GALERIA RACING */}
<section id="galeria" className="bg-black py-8 px-4">
  <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 max-w- mx-auto items-stretch">

    {/* IZQUIERDA - 2 VIDEOS */}
    <div className="flex flex-col gap-6">
      <div className="relative bg-black border- border-red-600 shadow-[6px_6px_0px_#000] overflow-hidden">
        <span className="absolute bottom-0 left-0 bg-red-600 text-white text- font-black px-3 py-1 z-10 tracking-widest">REPEAT LOOP</span>
        <video src="/repetirloop.mp4" autoPlay loop muted playsInline className="w-full aspect-[16/9] object-cover" />
      </div>
      <div className="relative bg-black border- border-red-600 shadow-[6px_6px_0px_#000] overflow-hidden">
        <span className="absolute bottom-0 left-0 bg-white text-black text- font-black px-3 py-1 z-10 tracking-widest">LOOP LIFE</span>
        <video src="/looplife.mp4" autoPlay loop muted playsInline className="w-full aspect-[16/9] object-cover" />
      </div>
    </div>

    {/* DERECHA - 2 COTIZADORES */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w- mx-auto w-full">

      {/* NEUMATICO */}
      <div className="relative bg-[#0F0F0F] border- border-red-600 shadow-[6px_6px_0px_#000] p-6 flex flex-col">
        <div className="absolute top-0 right-0 w-3 h-3 bg-red-600"></div>
        <div className="flex flex-col items-center mb-6">
          <img src="/icons/isometric_tire_stack_r888r.webp" alt="Neumatico" className="w-36 h-36 object-contain mb-3" />
          <h3 className="font-black italic text-2xl text-white uppercase text-center leading-none">COTIZA TU<br/><span className="text-red-600">NEUMÁTICO</span></h3>
        </div>
        <input placeholder="Marca" className="bg-black border border-white/10 p-3 mb-3 text-white font-bold outline-none text-sm" />
        <input placeholder="Medida ej: 225/45R17" className="bg-black border border-white/10 p-3 mb-3 text-white font-bold outline-none text-sm" />
        <select className="bg-black border border-white/10 p-3 mb-4 text-white font-bold outline-none text-sm">
          <option>Cantidad</option><option>1</option><option>2</option><option>4</option>
        </select>
        <a href={waLink} target="_blank" className="mt-auto bg-[#25D366] text-black font-black py-3 text-center text-sm hover:bg-white transition shadow-[4px_4px_0px_black]">ENVIAR POR WHATSAPP →</a>
      </div>

      {/* REPUESTO */}
      <div className="relative bg-[#0F0F0F] border- border-white/20 shadow-[6px_6px_0px_#000] p-6 flex flex-col">
        <div className="absolute top-0 right-0 w-3 h-3 bg-white"></div>
        <div className="flex flex-col items-center mb-6">
          <img src="/icons/red_carbon_sedan_service_icon.webp" alt="Repuesto" className="w-36 h-36 object-contain mb-3" />
          <h3 className="font-black italic text-2xl text-white uppercase text-center leading-none">COTIZA TU<br/><span className="text-white">REPUESTO</span></h3>
        </div>
        <input placeholder="Marca" className="bg-black border border-white/10 p-3 mb-3 text-white font-bold outline-none text-sm" />
        <input placeholder="Modelo / Año" className="bg-black border border-white/10 p-3 mb-3 text-white font-bold outline-none text-sm" />
        <input placeholder="Que repuesto necesitas?" className="bg-black border border-white/10 p-3 mb-4 text-white font-bold outline-none text-sm" />
        <a href={waLink} target="_blank" className="mt-auto bg-[#25D366] text-black font-black py-3 text-center text-sm hover:bg-white transition shadow-[4px_4px_0px_black]">ENVIAR POR WHATSAPP →</a>
      </div>

    </div>
  </div>

  {/* NUESTRAS MARCAS */}
  <div className="max-w- mx-auto mt-12">
    <h3 className="font-black italic text-2xl mb-4 tracking-wider text-white">NUESTRAS MARCAS</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 border border-white/10 p-6 bg-zinc-900/50">
      <div className="bg-white rounded-xl h-20 flex items-center justify-center p-3"><img src="/marcas/mannol.png" alt="Mannol" className="h-full object-contain" /></div>
      <div className="bg-white rounded-xl h-20 flex items-center justify-center p-3"><img src="/marcas/woxol.png" alt="Woxol" className="h-full object-contain" /></div>
      <div className="bg-white rounded-xl h-20 flex items-center justify-center p-3 border-2 border-dashed border-zinc-400"><span className="text-zinc-400 font-bold text-xs">+ MARCA</span></div>
      <div className="bg-white rounded-xl h-20 flex items-center justify-center p-3 border-2 border-dashed border-zinc-400"><span className="text-zinc-400 font-bold text-xs">+ MARCA</span></div>
    </div>
  </div>

  {/* GALERIA 35 FOTOS */}
  <div className="max-w- mx-auto mt-12">
    <h3 className="font-black italic text-2xl mb-4 tracking-wider text-white">GALERÍA TALLER</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
      {Array.from({ length: 35 }, (_, i) => `/taller/${i + 1}.jpg`).map((img, i) => (
        <div key={i} className="relative aspect-square overflow-hidden border- border-white/10 bg-zinc-900 group hover:border-red-600 transition">
          <img src={img} alt={`taller ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" loading="lazy" />
        </div>
      ))}
    </div>
  </div>
</section>

<section className="bg-gradient-to-r from-black via-zinc-900 to-black border-y-2 border-red-600 py-2 overflow-hidden relative">
  <div className="marquee flex w-max items-center">
    {[...marcas,...marcas].map((m, i) => (
      <div key={i} className="flex items-center gap-3 mx-6">
        <div className="relative w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5" style={{ boxShadow: "3px 3px 0px #dc2626" }}>
          <img src={m.logo} alt={m.name} className="w-full h-full object-contain" />
        </div>
        <span className="font-black italic text-base text-white">{m.name}</span>
      </div>
    ))}
  </div>
</section>

<section id="contacto" className="grid md:grid-cols-2">
  <div className="bg-zinc-900 p-8 md:p-16 flex flex-col justify-center">
    <h3 className="font-black italic text-3xl mb-2 text-white">ENCUÉNTRANOS</h3>
    <p className="text-white/60 font-bold">Rodolfo Briceño 2718, Concepción</p>
  </div>
  <div className="relative bg-black" style={{ minHeight: 400 }}>
    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3202.5!2d-73.06!3d-36.825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9669b5e5d0f0f0f1%3A0x0!2sRodolfo%20Brice%C3%B1o%202718%2C%20Concepci%C3%B3n%2C%20Chile!5e0!3m2!1ses!2scl!4v1" className="absolute inset-0 w-full h-full border-0 grayscale" loading="lazy" />
  </div>
</section>

<footer className="bg-black border-t-2 border-red-600 py-8 text-center text-white/30 text-xs font-bold tracking-widest">
  BALLADARES-MOTORS.CL © 2026
</footer>

<div className="fixed bottom-6 right-6 flex flex-row gap-4 items-center" style={{ zIndex: 9999 }}>
  <a href={INSTAGRAM} target="_blank" className="w- h- bg-white rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" className="w-18 h-18 object-contain" alt="IG" />
  </a>
  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="w- h- bg-[#25D366] rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-19 h-19 object-contain" alt="WA" />
  </a>
</div>
    </main>
  );
}