'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

const CarSVG = ({ eliminated = false, color = '#fff' }: any) => (
  <div style={{
    width: '70px',
    height: '70px',
    filter: eliminated? 'grayscale(1) brightness(0.25)' : `drop-shadow(0 0 8px ${color}80)`,
    opacity: eliminated? 0.80 : 1,
    transition: 'all 1s'
  }}>
    <img
      src="/skyline96_final_nobg.png"
      alt="skyline"
      className="w-full h-full object-contain"
      style={{ transform: 'rotate(180deg)' }} // punta hacia arriba
    />
  </div>
);

const COLORS = ['#fff', '#E10600', '#00D2FF', '#00FF88', '#FF6B00', '#A855F7', '#FFD000', '#FF2D78'];

const MARCAS_AUSPICIADORES = [
  { name: 'Apexi', logo: '/marcas/apexi.png' },
  { name: 'Bride', logo: '/marcas/bride.png' },
  { name: 'Nismo', logo: '/marcas/nismo.png' },
  { name: 'Garrett', logo: '/marcas/garrett.png' },
  { name: 'HKS', logo: '/marcas/hks.png' },
  { name: 'AEM', logo: '/marcas/aem.png' },
  { name: 'GReddy', logo: '/marcas/greddy.png' },
  { name: 'BMotors', logo: '/marcas/BB.png' },
  { name: 'Ntronic', logo: '/marcas/nismotronic_ecu.png' },
];

const shuffleReal = <T,>(array: T[]): T[] => {
  const a = [...array];
  for (let i = a.length - 1; i > 0; i--) {
    const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 4294967295;
    const j = Math.floor(rand * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function TombolaClient({ tickets, adminKey }: { tickets: any[], adminKey: string }) {
  const [search, setSearch] = useState('');
  const [ronda, setRonda] = useState(0);
  const [racers, setRacers] = useState<any[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [slotCount, setSlotCount] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [display50, setDisplay50] = useState<any[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isFinalCelebration, setIsFinalCelebration] = useState(false);
  const [rondasConfig] = useState(() => {
    const total = tickets.length >= 50? 50 : tickets.length;
    return [
      { label: 'NIVEL 1', count: total, y: 88 },
      { label: 'NIVEL 2', count: Math.min(total, 25), y: 68 },
      { label: 'NIVEL 3', count: 15, y: 48 },
      { label: 'NIVEL 4', count: 5, y: 28 },
      { label: 'NIVEL 5', count: 1, y: 8 },
    ];
  });
  const [show50, setShow50] = useState(false);
  const [random50, setRandom50] = useState<any[]>([]);
  const [activePool, setActivePool] = useState<any[] | null>(null);
  
  const [finalRaceActive, setFinalRaceActive] = useState(false);
const [raceProgress, setRaceProgress] = useState<any[]>([]); // {ticket_code, y, x, pos, speed, isOvertaking}
const [raceWinner, setRaceWinner] = useState<any>(null);
const [cameraShake, setCameraShake] = useState(false);

 const get50Random = () => {
  setShow50(true);
  setIsShuffling(true);
  setDisplay50([]);

  let ticks = 0;
  const interval = setInterval(() => {
    const fake = shuffleReal(tickets).slice(0, 50);
    setDisplay50(fake);
    ticks++;
    if (ticks > 60) {
      clearInterval(interval);
      const finalFifty = shuffleReal(tickets).slice(0, 50);
      setRandom50(finalFifty);
      setDisplay50(finalFifty);
      setIsShuffling(false);
    }
  }, 80);
};
  const cargar50EnPista = () => {
    const initial = random50.map((t, i) => ({
     ...t,
      x: 5 + (i % 25) * 3.8,
      y: 90 - Math.floor(i / 25) * 12,
      lane: i % 25,
      color: COLORS[i % COLORS.length],
      eliminated: false
    }));
    setActivePool(random50); setRacers(initial); setRonda(0); setSlotCount(initial.length); setWinner(null); setShow(false); setShow50(false);
  };

  const sourceTickets = activePool || [];
  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return sourceTickets.filter((t: any) => t.ticket_code.toLowerCase().includes(s)).sort((a: any, b: any) => a.ticket_code.localeCompare(b.ticket_code));
  }, [sourceTickets, search]);

  useEffect(() => {
	    if (!activePool) return;
    const initial = filtered.map((t, i) => ({
     ...t,
      x: 5 + (i % 25) * 3.8,
      y: 90 - Math.floor(i / 25) * 12,
      lane: i % 25,
      color: COLORS[i % COLORS.length],
      eliminated: false
    }));
    setRacers(initial); setRonda(0); setSlotCount(initial.length);
  }, [filtered]);

  const vivos = useMemo(() => racers.filter(r =>!r.eliminated), [racers]);

const handleNextClick = () => {
  if (racers.length === 0 || vivos.length === 0) return;
  if (animating || ronda >= 4 || countdown!== null || finalRaceActive) return;

  // Si es la FINAL, entra directo sin cuenta de 5
  if (vivos.length === 5 && ronda === 3) {
    nextRondaReal();
    return;
  }

  try {
    const s = new Audio('/flutter.MP3');
    s.volume = 0.8;
    s.play().catch(()=>{});
  } catch {}

  setCountdown(5);
  let c = 5;
  const timer = setInterval(() => {
    c--;
    if (c > 0) {
      setCountdown(c);
    } else {
      clearInterval(timer);
      setCountdown(null);
      nextRondaReal();
    }
  }, 1000);
};

const nextRondaReal = async () => {
  if (animating || ronda >= 4) return;

  // SI QUEDAN 5 -> CARRERA FINAL ÉPICA
  if (vivos.length === 5 && ronda === 3) {
    startFinalRace();
    return;
  }

  //... tu lógica normal para los otros niveles igual que antes
  setAnimating(true);
  const alive = racers.filter(r =>!r.eliminated);
  const nextConfig = rondasConfig[ronda + 1];
  let keep = nextConfig?.count || 1;

  let current = alive.length; const target = keep;
  const interval = setInterval(() => { current = Math.max(target, current - Math.ceil((current - target) / 4) - 1); setSlotCount(current); if (current <= target) clearInterval(interval); }, 60);
  await new Promise(r => setTimeout(r, 800));

  const shuffled = shuffleReal(alive);
  const survivorsList = shuffled.slice(0, keep);
  const survivors = new Set(survivorsList.map(s => s.ticket_code));
  const spacing = keep === 1? 0 : Math.min(5.5, 70 / (keep - 1));
  const totalWidth = (keep - 1) * spacing;
  const startX = 50 - totalWidth / 2;

  const newRacers = racers.map(r => {
    if (r.eliminated) return r;
    const isSurvivor = survivors.has(r.ticket_code);
    if (!isSurvivor) return {...r, eliminated: true };
    const idx = survivorsList.findIndex(s => s.ticket_code === r.ticket_code);
    return {...r, x: keep === 1? 50 : startX + idx * spacing, y: nextConfig.y, eliminated: false };
  });

  setRacers(newRacers);
  setRonda(r => r+1); setSlotCount(keep); setAnimating(false);
};

const startFinalRace = async () => {
  setAnimating(true);
  setFinalRaceActive(true);
  setCountdown(null);

  let winnerTicket = shuffleReal(vivos)[0]; // elegido al inicio pero NO SE MUESTRA
  let order = shuffleReal(vivos);

  const initial = order.map((r:any, i:number) => ({
   ...r,
    raceY: 92 + Math.random()*4, // todos abajo desordenados
    raceX: 15 + i * 14 + (Math.random()-0.5)*4,
    targetX: 15 + i * 14,
    baseSpeed: 0.09 + Math.random()*0.04, // velocidad base 1080p friendly
    speed: 0.09 + Math.random()*0.04,
    pos: i+1,
    isLeader: false,
    smoke: false,
    nitro: false,
    blocked: false,
    lastOvertake: 0
  }));
  setRaceProgress(initial);

  // SEMÁFORO
  setCountdown(3);
  for(let c=3; c>0; c--) {
    setCountdown(c);
    try { new Audio('/beep.mp3').play().catch(()=>{}) } catch {}
    await new Promise(r=> setTimeout(r, 800));
  }
  setCountdown(null);
  try { new Audio('/go.mp3').play().catch(()=>{}) } catch {}
  await new Promise(r=> setTimeout(r, 300)); // largada

  // CARRERA 40 SEGUNDOS
  let elapsed = 0;
  const duration = 40000;
  const tick = 50; // 20 fps
  const totalTicks = duration / tick; // 800 ticks

  const raceInterval = setInterval(() => {
    elapsed += tick;
    const progressPct = elapsed / duration; // 0 a 1

    setRaceProgress(prev => {
      let next = [...prev].map(p => {
        // velocidad varia segun zona de carrera
        let speedMod = 1;
        if(progressPct < 0.3) speedMod = 0.8 + Math.random()*0.4; // inicio caótico
        else if(progressPct < 0.7) speedMod = 0.9 + Math.random()*0.6; // mitad peleada
        else speedMod = 1.0 + Math.random()*0.3; // final apretado

        let newY = p.raceY - p.baseSpeed * speedMod;
        let newX = p.raceX + (p.targetX - p.raceX) * 0.05; // va hacia su targetX suave

        // EVENTO ALEATORIO CADA ~2 SEG
        if(Math.random() < 0.025 && elapsed - p.lastOvertake > 1500) {
          // CRUCE / OVER TAKE
          const newTarget = 12 + Math.random()*66; // cualquier carril
          p.targetX = newTarget;
          p.smoke = true;
          p.lastOvertake = elapsed;
          p.blocked = Math.random() < 0.3;
          if(Math.random() < 0.5){
            setCameraShake(true);
            setTimeout(()=>setCameraShake(false), 150);
          }
          setTimeout(()=> { p.smoke = false; p.blocked = false; }, 600);
        } else {
          // drift leve normal
          newX += (Math.random()-0.5)*0.3;
        }

        // NITRO SOLO DEL GANADOR Y SOLO AL FINAL 85% - 100%
        let isNitro = false;
        if(progressPct > 0.85 && p.ticket_code === winnerTicket.ticket_code){
          newY -= 0.35; // empuje final
          isNitro = progressPct > 0.88; // solo muestra efecto últimos 5 seg
        }

        return {...p, raceY: Math.max(4, newY), raceX: newX, nitro: isNitro, smoke: p.smoke };
      });

      // RECALCULAR POSICIONES (por Y) pero SIN MOSTRAR AMARILLO HASTA EL FINAL
      next.sort((a,b) => a.raceY - b.raceY);
      next = next.map((p,i)=>({...p, pos: i+1, isLeader: false})); // nadie es lider con color hasta el final

      // Si es el último 8%, ahora si marcamos lider pero solo con efecto blanco, no amarillo ganador
      if(progressPct > 0.92){
        next[0].isLeader = true;
      }

      // Termina cuando llega el tiempo o el primero cruza meta
      if(elapsed >= duration || next[0].raceY <= 8.5){
        clearInterval(raceInterval);
        // orden final = el ganador que elegimos debe ser el primero, lo forzamos sutilmente
        const winnerInList = next.find(p=> p.ticket_code === winnerTicket.ticket_code);
        if(winnerInList){
          winnerInList.raceY = Math.min(...next.map(n=>n.raceY)) - 0.5; // lo pone 1ro
        }
        next.sort((a,b) => a.raceY - b.raceY);
        setTimeout(()=> finishRace(winnerTicket, next), 600);
      }
      return next;
    });
  }, tick);
};

const finishRace = (winnerTicket:any, finalOrder:any[]) => {
  setRaceProgress(finalOrder.map((p,i)=>({...p, pos: i+1, isLeader: i===0})));
  setRaceWinner(winnerTicket);
  setCameraShake(true);
  try { new Audio('/fireworks.mp3').play().catch(()=>{}) } catch {}

  setTimeout(()=>{
    setFinalRaceActive(false);
    setIsFinalCelebration(true);
    setWinner(winnerTicket);
    setRacers(prev => prev.map(r => ({
     ...r,
      x: r.ticket_code === winnerTicket.ticket_code? 50 : r.x,
      y: r.ticket_code === winnerTicket.ticket_code? 8 : r.y,
      eliminated: r.ticket_code!== winnerTicket.ticket_code
    })));
    setRonda(4);
    setSlotCount(1);
    setAnimating(false);
    setTimeout(()=> setShow(true), 1500);
  }, 1200);
};

const reset = () => {
  setActivePool(null);
  setRandom50([]);
  setRacers([]);
  setRonda(0);
  setWinner(null);
  setShow(false);
  setShow50(false);
  setSlotCount(0);
  setSearch('');
  // FIX FINAL RACE
  setFinalRaceActive(false);
  setRaceProgress([]);
  setRaceWinner(null);
  setIsFinalCelebration(false);
  setCameraShake(false);
  setCountdown(null);
  setAnimating(false);
};

  return (
    <div className="h-screen w-screen bg-[#080808] text-white flex flex-col overflow-hidden">
      <div className="h-12 flex items-center justify-between px-3 bg-gradient-to-b from-[#1a1a1a] to-[#000] border-b-2 border-[#E10600] shrink-0 z-20">
  <div className="flex items-center gap-3 shrink-0">
    <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#E10600] to-[#B00000] text-white px-3 py-1 rounded-full font-black border border-[#FF3333] text-xs">📹 EN VIVO <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /></div>
    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar BM..." className="w-44 h-8 bg-[#1a1a1a] border border-zinc-700 rounded-full px-4 text-xs font-mono outline-none" />
    <div className="hidden md:flex items-center gap-2 text- font-mono text-zinc-400 tracking-widest border border-zinc-800 rounded-full px-3 py-1 bg-black">
      BALLADARES MOTORS © 2026  
    </div>
  </div>
  <button onClick={get50Random} className="h-8 px-8 rounded-full bg-gradient-to-b from-[#FFD000] to-[#FFB000] text-black font-black text-xs border border-[#FFD000]">🎲 TRAER 50 AL AZAR</button>
  <div className="flex gap-1.5 shrink-0">
<button onClick={reset} className="h-8 px-8 rounded-full bg-white text-black text-xs font-black">↻ RESET</button>
    <Link href={`/ruth/Alexandra`} className="h-8 px-3 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-black grid place-items-center">VOLVER</Link>
  </div>
</div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        <div className="w- min-w- bg-gradient-to-b from-[#111] to-[#0a0a0a] border-r border-zinc-800 flex flex-col shrink-0 overflow-hidden">
          <div className="p-3 bg-black border-b border-zinc-800 shrink-0">
            <div className="w-full h- bg-black-to-b from-black to-zinc-200 rounded- border-2 border-red flex items-center justify-center overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,1)] mb-2">
              <img src="/BB.png" alt="Balladares" className="w- h- object-contain" style={{ maxWidth: '160px', maxHeight: '38px' }} />
            </div>
            <div className="mt-3 h-12 bg-gradient-to-br from-[#E10600] to-[#8B0000] rounded- px-3 flex justify-between items-center border border-[#FF3333]">
              <div><div className="text- font-mono font-black">VIVOS EN PISTA</div></div>
              <div className="bg-white text-black w-10 h-10 rounded-full grid place-items-center font-black">{vivos.length}</div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2.5">
            <div className="grid grid-cols-2 gap-1.5">
              {vivos.map((t:any) => (
                <div key={t.ticket_code} className="h-6 rounded-full grid place-items-center text- font-mono font-black bg-[#222] border border-zinc-700 truncate">
                  <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: t.color }} />{t.ticket_code}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-2 gap-2 min-w-0 overflow-hidden bg-[#050505]">
          <div className="flex gap-1.5 shrink-0">
            {rondasConfig.map((r,i) => (
              <div key={i} className={`flex-1 h-7 rounded-full grid place-items-center text- font-black border-2 ${i < ronda? 'bg-white text-black border-white' : i===ronda? 'bg-[#E10600] text-white border-[#FF3333]' : 'bg-[#222] text-zinc-500 border-zinc-700'}`}>
                {r.label} → {r.count}
              </div>
            ))}
          </div>

          <div className="flex-1 bg-[#0e0e0e] border- border-zinc-800 rounded-xl relative overflow-hidden min-h-0 shadow-[inset_0_0_100px_black]">

  {/* ASFALTO */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#222_0%,_#0a0a0a_80%)]" />

  {/* MARCA DE AGUA COPA */}
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
    <img src="/copa_balladares_3d_FINAL.png" className="w- h- object-contain opacity-[0.07]" />
  </div>

{/* BORDES LATERALES TIPO PISTA - DIAGONAL REAL */}
{!finalRaceActive && (
  <>
    <div className="absolute top-0 left-0 w-3 h-full bg-[repeating-linear-gradient(0deg,white_0px,white_12px,red_12px,red_24px)] opacity-60" />
    <div className="absolute top-0 right-0 w-3 h-full bg-[repeating-linear-gradient(0deg,white_0px,white_12px,red_12px,red_24px)] opacity-60" />
    <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,white_0px,white_20px,black_20px,black_40px)] border-b-2 border-white/50 z-20" />
  </>
)}
 
{finalRaceActive && (
  <div className={`absolute inset-0 z-40 bg-[#080808] ${cameraShake? 'animate-[shake_0.12s_ease_infinite]' : ''}`}>
    {/* PISTA NEGRA */}
    <div className="absolute inset-0 bg-[#0a0a0a]" />

    {/* CEBRAS LATERALES ROJO/BLANCO - ESTAS SON LAS QUE TE FALTAN WN */}
    <div className="absolute top-0 bottom-0 left-0 w-7 z-30" style={{ backgroundImage: `repeating-linear-gradient(-45deg, #ffffff 0px, #ffffff 14px, #E10600 14px, #E10600 28px)`, borderRight: `2px solid white` }} />
    <div className="absolute top-0 bottom-0 right-0 w-7 z-30" style={{ backgroundImage: `repeating-linear-gradient(45deg, #ffffff 0px, #ffffff 14px, #E10600 14px, #E10600 28px)`, borderLeft: `2px solid white` }} />

    {/* META EN LA LINEA ROJA QUE MARCASTE - 14% */}
    <div className="absolute top-[3%] left-7 right-7 h-8 z-30 flex items-center justify-center" style={{ backgroundImage: `repeating-linear-gradient(90deg, white 0px, white 24px, black 24px, black 48px)`, boxShadow: `0 0 20px white`, borderTop: `2px solid white`, borderBottom: `2px solid white` }}>
      <div className="bg-black border border-white px-5 py-1">
        <span className="text-white font-black text- tracking-[0.4em]">META FINAL 2026 • 1/2 Milla </span>
      </div>
    </div>

    {/* CARRILES QUE SE MUEVEN - ARREGLADO */}
    <div className="absolute inset-0 left-7 right-7 pointer-events-none">
      <div className="absolute inset-0 flex justify-evenly opacity-60">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w- h-[200%] -mt-[50%]" style={{ backgroundImage: `repeating-linear-gradient(180deg, white 0px, white 22px, transparent 22px, transparent 44px)`, animation: `scrollDown 0.28s linear infinite` }} />
        ))}
      </div>
    </div>

    {/* ASFALTO QUE BAJA */}
    <div className="absolute inset-0 left-7 right-7 opacity-20" style={{ backgroundImage: `linear-gradient(transparent 0%, transparent 90%, rgba(255,255,255,0.15) 90%, rgba(255,255,255,0.15) 100%)`, backgroundSize: '100% 80px', animation: 'scrollDown 0.6s linear infinite' }} />

    {/* TABLA Y AUTOS IGUAL QUE ANTES */}
    <div className="absolute top-[40%] left-10 bg-black/95 border border-zinc-700 rounded-xl p-3 z-50 backdrop-blur">
      <div className="text-white font-black text- tracking-[0.3em] mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-[#E10600] rounded-full animate-pulse" /> CARRERA FINAL - 1/2 Milla</div>
      {raceProgress.slice().sort((a,b)=>a.pos-b.pos).map((p:any)=>(
        <div key={p.ticket_code} className={`flex items-center gap-2 text-xs font-mono font-black py-1.5 px-2 rounded-full ${p.pos===1 && p.raceY < 15? 'bg-white text-black scale-105' : 'text-zinc-400 bg-zinc-900/50'}`}>
          <span className="w-5">{p.pos}.</span><span className="w-2 h-2 rounded-full" style={{background: p.color}} /><span className="truncate">{p.ticket_code}</span>
        </div>
      ))}
    </div>

    {raceProgress.map((p:any)=>(
      <div key={p.ticket_code} className="absolute" style={{ left: `${p.raceX}%`, top: `${p.raceY}%`, transform: 'translateX(-50%)', transition: 'left 0.8s ease-out' }}>
        {p.smoke && <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-16 h-10 bg-white/40 blur rounded-full" />}
        {p.nitro && <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-14 h-10 bg-gradient-to-t from-cyan-400 to-transparent blur" />}
        <CarSVG color={p.color} eliminated={false} />
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text- font-black bg-zinc-900 border border-zinc-700 text-white whitespace-nowrap">{p.ticket_code}</div>
      </div>
    ))}
  </div>
)}

<style jsx global>{`
  @keyframes shake { 0%{transform:translate(1px,1px)} 50%{transform:translate(-1px,-1px)} 100%{transform:translate(1px,-1px)} }
  @keyframes scrollDown { 0%{transform:translateY(0)} 100%{transform:translateY(60px)} }
`}</style>

  {/* CARRILES */}
  <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`, backgroundSize: '50px 50px' }} />

  {/* COPA + GIF GANADOR - SOLO UNA VEZ */}
  <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 pointer-events-none">
    {isFinalCelebration && winner && (
  <div className="absolute top-[1%] left-[58%] -translate-x-1/2 z-30 flex items-center gap-5 animate-[popIn_0.5s_ease_forwards] pointer-events-none">

    {/* COPA */}
    <img
      src="/copa_balladares_3d_FINAL.png"
      alt="copa"
      className="w-20 h-20 md:w-28 md:h-28 object-contain drop-shadow-[0_0_20px_rgba(255,215,0,0.8)] shrink-0"
    />

    <div className="flex flex-col gap-2 pointer-events-auto relative shrink-0">
      <div className="px-8 py-3 bg-white text-black font-black text-4xl italic -skew-x-6 shadow-[0_0_40px_white] whitespace-nowrap">
        {winner.ticket_code}
      </div>

      <div className="px-5 py-1.5 bg-[#E10600] text-white font-black text-sm rounded-full animate-pulse text-center border border-white tracking-widest">
        ¡GANADOR!
      </div>

      {/* NOMBRE DEL GANADOR */}
      <div className="px-4 py-1.5 bg-black/80 backdrop-blur border border-[#FFD000]/50 rounded-full text-center">
        <p className="text-[#FFD000] font-black text- tracking-widest uppercase truncate max-w-">
          {winner.nombre || winner.name} • {winner.ticket_code}
        </p>
      </div>
    </div>

    {/* LOGO MOTORS */}
    <img
      src="/BB.png"
      alt="Balladares Motors"
      className="w-32 md:w-40 object-contain drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] shrink-0"
    />
  </div>
)}
  </div>

   <div className="absolute top-[18%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  <div className="absolute top-[38%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  <div className="absolute top-[58%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  <div className="absolute top-[78%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

 {!finalRaceActive && racers.map((r:any) => {
    if (isFinalCelebration && winner && r.ticket_code === winner.ticket_code) return null;
    const xPos = r.x?? (5 + (r.lane * 3.6));
    return (
      <div key={r.ticket_code} className="absolute transition-all duration-1000 ease-out" style={{ left: `${xPos}%`, top: `${r.y}%`, transform: 'translateX(-50%)' }} onMouseEnter={() => setHovered(r.ticket_code)} onMouseLeave={() => setHovered(null)}>
        <CarSVG color={r.color} eliminated={r.eliminated} />
        {hovered === r.ticket_code &&!r.eliminated && (
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text- font-mono font-black bg-white text-black border-2 border-white whitespace-nowrap z-30 pointer-events-none">
            {r.ticket_code}
          </div>
        )}
      </div>
    );
  })}

  {/* AQUI VA EL PUNTO 4 - CUENTA REGRESIVA */}
{countdown!== null && (
  <div className="absolute inset-0 z-50 bg-black/85 flex flex-col items-center justify-center overflow-hidden">

    {/* turbo de fondo más oscuro pa que se lea */}
    <img src="/turbo.gif" className="absolute inset-0 w-full h-full object-cover opacity-[0.18]" />
    <div className="absolute inset-0 bg-black/40" />

    <div className="relative z-10 flex flex-col items-center gap-2">

      {/* TEXTO ARRIBA - MÁS GRANDE Y BLANCO */}
      <div className="text-white font-black tracking-[0.5em] text-lg md:text-xl drop-shadow-[0_0_20px_white]">
        SIGUIENTE NIVEL EN
      </div>

      {/* NÚMERO GIGANTE */}
      <div
        key={countdown}
        className="text-[160px] md:text- font-black leading-none text-white animate-[popIn_0.15s_ease]
        drop-shadow-[0_0_30px_rgba(225,6,0,1)]
        [text-shadow:_0_0_40px_white,_0_0_80px_#E10600]"
      >
        {countdown}
      </div>

      {/* BARRA */}
      <div className="mt-2 w- h-4 bg-zinc-900 rounded-full overflow-hidden border-2 border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.8)]">
        <div className="h-full bg-gradient-to-r from-white via-[#E10600] to-[#FF3333] transition-all duration-1000 ease-linear" style={{ width: `${(countdown/5)*100}%` }} />
      </div>

    </div>
  </div>
)}
</div>

         <div className="h-[62px] bg-black border-t-2 border-[#E10600] flex items-center overflow-hidden shrink-0 relative z-10">

  <div className="flex-1 overflow-hidden h-full flex items-center relative">
    <div className="flex w-max items-center gap-0 animate-marquee">
      {[...MARCAS_AUSPICIADORES,...MARCAS_AUSPICIADORES,...MARCAS_AUSPICIADORES].map((marca, i) => (
        <div key={`${marca.name}-${i}`} className="flex items-center gap-10 shrink-0 px-10">
          <img
            src={marca.logo}
            alt={marca.name}
            className="h-[34px] md:h-[42px] w-auto object-contain"
          />
          <span className="w-1 h-1 bg-zinc-700 rounded-full" />
        </div>
      ))}
      <div className="flex items-center gap-10 shrink-0 px-10">
        <span className="text-white font-black text-xs tracking-[0.4em]">🏁 BALLADARES MOTORS</span>
        <span className="w-1 h-1 bg-[#E10600] rounded-full" />
        <span className="text-[#FFD000] font-black text-[10px] tracking-widest">TALLER • LUBRICENTRO • DETAILING</span>
        <span className="w-1 h-1 bg-zinc-700 rounded-full" />
      </div>
    </div>

    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent pointer-events-none" />
    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
  </div>

  <button
    onClick={handleNextClick}
    disabled={racers.length === 0 || vivos.length === 0 || animating || countdown!== null}
    className={`h-full px-7 font-black text-[11px] tracking-widest shrink-0 ml-2 transition-all border-l border-zinc-800 ${
      racers.length === 0? 'bg-zinc-900 text-zinc-600' : 'bg-white text-black hover:bg-[#FFD000]'
    }`}
  >
    {racers.length === 0? '⚠ CARGA AUTOS' : `▶ ${rondasConfig[ronda]?.label} → ${rondasConfig[ronda + 1]?.count?? 1}`}
  </button>

  <style jsx global>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-25%); }
    }
  .animate-marquee {
      animation: marquee 25s linear infinite;
    }
  `}</style>
</div>
                </div>
      </div>

{show50 && (
  <div className="fixed inset-0 bg-black z-[60] flex items-center justify-center">
    <div className="bg-black w-full max-w-4xl flex flex-col h- overflow-hidden">

      <div className="p-4 flex justify-between items-center bg-black shrink-0">
        <div>
          <div className="font-black italic text-lg">
            {isShuffling? '🔥 MEZCLANDO TÓMBOLA...' : '🎲 50 STICKERS AL AZAR'}
          </div>
          <div className="text-xs font-mono text-zinc-500">
            {isShuffling? `Revolviendo ${tickets.length} tickets...` : `Se trajeron ${random50.length} de ${tickets.length} totales`}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-black ${isShuffling? 'bg-red-600 text-white animate-pulse' : 'bg-[#FFD000] text-black'}`}>
          {isShuffling? '🎰' : `${random50.length} / 50`}
        </div>
      </div>

      <div className="flex-1 bg-black flex flex-col items-center justify-center overflow-hidden">
        {isShuffling? (
          <div className="w-full h-full flex flex-col items-center justify-center gap-8 bg-black">
            <div className="w-full h- bg-black relative">
              <video
                src="/burn.mp4"
                autoPlay
               loop={false}
                
                playsInline
                preload="auto"
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="text-3xl font-black tracking-[0.3em] text-white animate-pulse">
              MEZCLANDO...
            </div>
          </div>
        ) : (
          <div className="w-full p-6 grid grid-cols-5 gap-2 overflow-auto">
            {random50.map((t:any, i:number) => (
              <div
                key={t.ticket_code}
                className="h-7 bg-[#1a1a1a] border border-zinc-800 rounded-full grid place-items-center text- font-mono font-black animate-[popIn_0.3s_ease_forwards] opacity-0 translate-y-2"
                style={{ animationDelay: `${i * 20}ms` }}
              >
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  {t.ticket_code}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 flex justify-between bg-black shrink-0 border-t border-zinc-900">
        <button onClick={() => setShow50(false)} className="h-9 px-5 rounded-full bg-zinc-900 border border-zinc-800 text-white font-black text-xs">
          ✕ CERRAR
        </button>
        <div className="flex gap-2">
          <button
            onClick={get50Random}
            disabled={isShuffling}
            className="h-9 px-5 rounded-full bg-zinc-800 text-white font-black text-xs disabled:opacity-20"
          >
            🎲 50 NUEVOS
          </button>
          <button
            onClick={cargar50EnPista}
            disabled={isShuffling}
            className="h-9 px-6 rounded-full bg-[#E10600] text-white font-black text-xs disabled:opacity-20"
          >
            🏁 CARGAR {isShuffling? '...' : `${random50.length} EN PISTA`}
          </button>
        </div>
      </div>
    </div>

    <style jsx>{`
	@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
      @keyframes popIn {
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  </div>
)}

     
    </div>
  );
}