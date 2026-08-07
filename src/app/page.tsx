"use client";
import { useState, useEffect } from "react";
import { Montserrat, Holtwood_One_SC } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400","700","900"] });
const holtwood = Holtwood_One_SC({ weight: "400", subsets: ["latin"] });

const WHATSAPP = "56982637808"; // numero principal general
const WHATSAPP_NEUMATICO = "56991770158"; // pon aquí el numero de neumáticos
const WHATSAPP_REPUESTO = "56991770158"; // pon aquí el numero de repuestos
const INSTAGRAM = "https://www.instagram.com/balladaresmotor/";
const YOUTUBE_ID = "0q6KurtImDI";

const slides = [
  { title: ["repro stage", "DPF-EGR-ADBLUE"], titleImgs: ["/hero/titles/repro_stage_transparent.png", "/hero/titles/1and2_transparent.png"], sub: "Potencia real +25% torque +30%", img: "/hero/repro.jpg", pos: "50% 50%" },
  { title: ["servicios de", "pista y calle"], titleImgs: ["/hero/titles/servicios_de_transparent.png", "/hero/titles/pista_y_calle_transparent.png"], sub: "Alineación 3D, balanceo, elevadores pro", img: "/hero/pista.jpg", pos: "50% 82%" },
  { title: ["diagnostico de", "ultima generacion"], titleImgs: ["/hero/titles/diagnostico_de_transparent.png", "/hero/titles/ultima_generacion_transparent.png"], sub: "Scanner multimarca - Todas las marcas", img: "/hero/scanner.jpg", pos: "50% 50%" },
];

const servicios = [
  { n: "Repro DPF - EGR - ADBLUE OFF", p: "Desde $150.000", d: "Libera el verdadero potencial oculto de tu ECU. Potencia tu auto de forma segura +torque +potencia +economia. Stage 1 - Stage 2 - DPF - EGR - ADBLUE y más...", icon: "/icons/turbochip_isometric_icon.webp", accent: "from-red-600 to-orange-500", badge: "POPULAR" },
  { n: "Scanner Multimarca", p: "Desde $15.000", d: "Diagnóstico profundo con equipamiento de última generación. Soporte Tecnico en diferentes marcas.", icon: "/icons/obd2_scanner_icon.webp", accent: "from-blue-600 to-cyan-400", badge: "DIAGNOSTICO" },
  { n: "Alineación con Laser + Balanceo", p: "Desde $35.000", d: "Precisión milimétrica con sistema láser 3D. Evita el desgaste excesivo de tus neumaticos y vibraciones al conducir.", icon: "/icons/wheel_alignment_icon.webp", accent: "from-zinc-600 to-zinc-400", badge: "LASER" },  
  { n: "Ajuste Motor", p: "Cotizar", d: "Armado y rectificación de motores de estandar y alto rendimiento. Resultados optimos con el soporte de diferentes maestranzas.", icon: "/icons/balladares_motors_emblem_transparent.webp", accent: "from-red-600 to-red-800", badge: "AJUSTE" },
  { n: "Mecánica General", p: "Cotizar", d: "Encuentra todos los servicios basicos en un solo lugar - mantencion por kilometraje - servicio de diagnostico - reparacion tren delantero - reparacion y mantencion sistema de frenos - afinamiento - cambio aceite y muchos mas cotiza aca.", icon: "/icons/sr20_neo_vvl_balladares.webp", accent: "from-zinc-700 to-zinc-500", badge: "MECANICA GENERAL" },
  { n: "Venta Etanol / Metanol ", p: "Cotizar", d: "Protege tu motor con combustible de carrera.", icon: "/icons/racing_fuel_canister_icon.webp", accent: "from-orange-600 to-red-600", badge: "RACING FUEL" },
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
  const [showGaleria, setShowGaleria] = useState(false);
  useEffect(()=>{ const t=setInterval(()=>setI(p=>(p+1)%slides.length),5000); return()=>clearInterval(t) },[]);
  const waLinkNeumatico = "https://wa.me/" + WHATSAPP_NEUMATICO + "?text=" + encodeURIComponent(
  "Hola Balladares Motors! - Quiero cotizar NEUMATICO:\n\n" +
  "- Marca neumatico: \n" +
  "- Medida: ej 195/50R15\n\n" +
  "Quedo atento!"
);

const waLinkRepuesto = "https://wa.me/" + WHATSAPP_REPUESTO + "?text=" + encodeURIComponent(
  "Hola Balladares Motors! - Quiero cotizar REPUESTO:\n\n" +
  "- Envianos una foto de tu patente o padrón \n" +
  "- Envianos 2 o 3 fotos de referencia de tu repuesto \n\n" +
  "Mi vehiculo es:\n" +
  "Modelo:\n" +
  "Año:\n\n" +
  "Quedo atento!"
);
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
  <div className="hidden lg:flex gap-3 text-sm font-black tracking-wider absolute left-1/2 -translate-x-1/2">
    {[{id:"inicio", label:"INICIO"},{id:"nosotros", label:"NOSOTROS"},{id:"servicios", label:"SERVICIOS"},{id:"galeria", label:"GALERÍA"},{id:"contacto", label:"CONTACTO"}].map(link=>(
      <a key={link.id} href={`#${link.id}`} className="relative px-4 py-2 border border-white/10 hover:border-red-600 hover:bg-red-600/10 group" style={{transform:"skewX(-12deg)"}}><span className="group-hover:text-red-500" style={{transform:"skewX(12deg)", display:"block"}}>{link.label}</span></a>
    ))}
</div>
  <h2 className={`${holtwood.className} absolute bottom-[4px] right-[10px] md:bottom-[8px] md:right-[14px] text-[13px] md:text-[16px] font-black italic leading-[0.9] tracking-wider text-white text-right`}>
  <span className="block md:inline">EL PODER DE UN</span>
  <span className="block text-red-600 md:inline md:ml-1.5">BUEN SERVICIO</span>
</h2>
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
		
		
     {/* REVISION PRE-COMPRA */}
  <div className="group relative cursor-pointer">
    <div className="absolute bg-black group-hover:bg-red-600 transition-all" style={{inset:-1, transform:"skewX(-3deg)"}} />
    <div className="relative bg-white p-0.5" style={{transform:"skewX(-3deg)"}}>
      <div className="bg-white overflow-hidden" style={{transform:"skewX(3deg)"}}>
        <div className="relative bg-white flex items-center justify-center p-4" style={{height:280}}>
          <img src="/racing_inspection_white_background.webp" alt="Revision Pre-Compra" className="w-11/12 h-11/12 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-0 left-0 w-full bg-black" style={{height:6}} />
          <div className="absolute top-3 right-3 bg-black text-white text-xs font-black tracking-widest px-3 py-1.5">PRE-COMPRA</div>
        </div>
        <div className="p-5">
          <div className="font-black text-[17px] italic leading-tight">REVISIÓN PRE-COMPRA</div>
          <div className="mt-2 text-black/60 text-[13px] leading-tight">Háblanos, deja agendado y reservada tu hr para revisión pre-compra</div>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero agendar mi hora para Revisión Pre-Compra")}`} target="_blank" className="mt-4 inline-flex w-full justify-center bg-black text-white py-3 text-sm font-black group-hover:bg-red-600 transition">AGENDAR HORA →</a>
        </div>
      </div>
    </div>
  </div>

  {/* VITRINA TALLERES */}
  <div className="group relative cursor-pointer">
    <div className="absolute bg-black group-hover:bg-red-600 transition-all" style={{inset:-1, transform:"skewX(-3deg)"}} />
    <div className="relative bg-white p-0.5" style={{transform:"skewX(-3deg)"}}>
      <div className="bg-white overflow-hidden" style={{transform:"skewX(3deg)"}}>
        <div className="relative bg-white flex items-center justify-center p-4" style={{height:280}}>
          <img src="/isometric_racing_podium.webp" alt="Vitrina Talleres" className="w-11/12 h-11/12 object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute top-0 left-0 w-full bg-red-600" style={{height:6}} />
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-black tracking-widest px-3 py-1.5">VITRINA</div>
        </div>
        <div className="p-5">
          <div className="font-black text-[15px] italic leading-tight">¿QUIERES APARECER EN NUESTRA PÁGINA?</div>
          <div className="mt-2 text-black/60 text-[13px] leading-tight">Envíanos por qué debería estar tu nombre o marca de taller en nuestra vitrina de los mejores talleres</div>
          <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola, quiero que mi taller aparezca en la vitrina de Balladares Motors")}`} target="_blank" className="mt-4 inline-flex w-full justify-center bg-black text-white py-3 text-sm font-black group-hover:bg-red-600 transition">POSTULAR TALLER →</a>
        </div>
      </div>
    </div>
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

    {/* DERECHA - 2 COTIZADORES - SIN INPUTS */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w- mx-auto w-full">

  {/* NEUMATICO */}
  <div className="relative bg-black border- border-red-600 shadow-[6px_6px_0px_#000] p-6 flex flex-col items-center">
    <div className="w-full bg-black flex items-center justify-center h-">
      <img src="/icons/isometric_tire_stack_r888r.webp" alt="Neumatico" className="w- h- object-contain" />
    </div>
    <h3 className="font-black italic text-2xl text-white uppercase text-center leading-none mt-4 mb-6">COTIZA TU<br/><span className="text-red-600">NEUMÁTICO</span></h3>
	<h3 className="font-black italic text-1xl text-white uppercase text-center leading-none mt-4 mb-6">hablanos por whatsapp y completa el formulario</h3>
	
    <a href={waLinkNeumatico} target="_blank" className="mt-auto w-full bg-[#25D366] text-black font-black py-3 text-center text-sm hover:bg-white transition shadow-[4px_4px_0px_black]">ENVIAR POR WHATSAPP →</a>
  </div>

  {/* REPUESTO */}
  <div className="relative bg-black border- border-white/20 shadow-[6px_6px_0px_#000] p-6 flex flex-col items-center">
    <div className="w-full bg-black flex items-center justify-center h-">
      <img src="/icons/red_carbon_sedan_service_icon.webp" alt="Repuesto" className="w- h- object-contain" />
    </div>
    <h3 className="font-black italic text-2xl text-white uppercase text-center leading-none mt-4 mb-6">COTIZA TU<br/><span className="text-red-600">REPUESTO</span></h3>
	<h3 className="font-black italic text-1xl text-white uppercase text-center leading-none mt-4 mb-6">hablanos por whatsapp y completa el formulario</h3>

    <a href={waLinkRepuesto} target="_blank" className="mt-auto w-full bg-[#25D366] text-black font-black py-3 text-center text-sm hover:bg-white transition shadow-[4px_4px_0px_black]">ENVIAR POR WHATSAPP →</a>
  </div>
</div>
</div>

{/* NUESTRAS MARCAS - FOTO UNICA MURAL - TAMAÑO CONTROLADO */}
<div className="max-w-[800px] mx-auto mt-20 px-4">
  <h3 className="font-black italic text-4xl text-white uppercase text-center leading-none mt-4 mb-6">NUESTRAS<br/><span className="text-red-600">MARCAS</span></h3>

  <div className="relative bg-[#0A0A0A] border border-white/10 p-2 shadow-[6px_6px_0px_#dc2626] mx-auto">
    <img
      src="/balladares_motors_workshop.webp"
      alt="Nuestras Marcas - Balladares Motors"
      className="w-full h- md:h- object-cover object-center mx-auto"
    />
  </div>
</div>

  
  
  {/* GALERIA 35 FOTOS - 10 VISIBLES + DESPLEGABLE */}
<div className="max-w-[1600px] mx-auto mt-12">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-black italic text-2xl tracking-wider text-white">GALERÍA TALLER</h3>
    <button onClick={() => setShowGaleria(!showGaleria)} className="bg-white text-black font-black px-6 py-2 text-sm hover:bg-red-600 hover:text-white transition border-[2px] border-black shadow-[4px_4px_0px_#000]">
      {showGaleria? 'VER MENOS ↑' : `VER ${35-10} FOTOS MÁS ↓`}
    </button>
  </div>
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
    {Array.from({ length: showGaleria? 35 : 10 }, (_, i) => `/taller/${i + 1}.jpg`).map((img, i) => (
      <div key={i} className="relative aspect-square overflow-hidden border-[2px] border-white/10 bg-zinc-900 group hover:border-red-600 transition">
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

<section id="contacto" className="grid grid-cols-1 md:grid-cols-2 border-t border-white/10">
  <div className="bg-zinc-900 p-6 md:p-8 flex flex-col gap-8">
    <div>
      <h3 className="font-black italic text-4xl md:text-5xl text-white leading-none tracking-tighter">ENCUÉNTRANOS</h3>
      <p className="text-white/60 font-bold text-sm mt-3">Rodolfo Briceño 2718, Concepción</p>
    </div>
    <div className="flex flex-col gap-6">
      <img src="/BB.png" alt="Balladares Motors" style={{ width: "300px", height: "330" }} />
      <img src="/LB.png" alt="Lubricentro" style={{ width: "315px", height: "auto" }} />
    </div>
  </div>

  <div className="w-full h- md:h- bg-black overflow-hidden">
    <iframe
      src="https://maps.google.com/maps?q=Rodolfo%20Brice%C3%B1o%202718%2C%20Concepci%C3%B3n%2C%20Chile&t=&z=16&ie=UTF8&iwloc=&output=embed"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  </div>
</section>

<footer className="bg-black border-t-2 border-red-600 py-8 text-center text-white/30 text-xs font-bold tracking-widest">
  BALLADARES-MOTORS.CL © 2026
</footer>

<div className="fixed bottom-6 right-6 flex flex-row gap-4 items-center" style={{ zIndex: 9999 }}>
  <a href={INSTAGRAM} target="_blank" className="w- h- bg-white rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" className="w-11 h-11 object-contain" alt="IG" />
  </a>
  <a href={`https://wa.me/${WHATSAPP}`} target="_blank" className="w- h- bg-[#25D366] rounded-full flex items-center justify-center border- border-black shadow-[5px_5px_0px_black] hover:scale-110 transition">
    <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-12 h-12 object-contain" alt="WA" />
  </a>
</div>
    </main>
  );
}