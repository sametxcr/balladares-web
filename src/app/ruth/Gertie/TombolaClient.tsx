'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';

const CarSVG = ({ eliminated = false, color = '#fff', size = 70 }: any) => (
  <div style={{
    width: `${size}px`,
    height: `${size}px`,
    filter: eliminated? 'grayscale(1) brightness(0.25)' : `drop-shadow(0 0 12px ${color}90)`,
    opacity: eliminated? 0.80 : 1,
    transition: 'all 1s'
  }}>
    <img
      src="/skyline96_final_nobg.png"
      alt="skyline"
      className="w-full h-full object-contain"
      style={{ transform: 'rotate(180deg)' }}
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

const DragTree = ({ step, fading }: { step: number, fading: boolean }) => {
  return (
    <div className={`flex flex-col items-center bg-black border-4 border-zinc-700 rounded- p-3 shadow-[0_0_60px_rgba(255,0,0,0.6)] transition-all duration-1000 ${fading? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
      <div className="text-red-500 font-mono font-black text- tracking-widest mb-2">BALLADARES</div>
      <div className="flex gap-3 mb-2">
        <div className={`w-5 h-5 rounded-full ${step >= 1? 'bg-[#FFD000] shadow-[0_0_12px_#FFD000]' : 'bg-zinc-800'}`} />
        <div className={`w-5 h-5 rounded-full ${step >= 1? 'bg-[#FFD000] shadow-[0_0_12px_#FFD000]' : 'bg-zinc-800'}`} />
      </div>
      <div className="flex gap-3 mb-4">
        <div className={`w-5 h-5 rounded-full ${step >= 2? 'bg-[#FFD000] shadow-[0_0_12px_#FFD000]' : 'bg-zinc-800'}`} />
        <div className={`w-5 h-5 rounded-full ${step >= 2? 'bg-[#FFD000] shadow-[0_0_12px_#FFD000]' : 'bg-zinc-800'}`} />
      </div>
      <div className="flex flex-col gap-2 mb-3">
        <div className={`w-11 h-11 rounded-full border-2 ${step >= 3? 'bg-[#FFD000] border-white shadow-[0_0_20px_#FFD000]' : 'bg-zinc-900 border-zinc-700'}`} />
        <div className={`w-11 h-11 rounded-full border-2 ${step >= 4? 'bg-[#FFD000] border-white shadow-[0_0_20px_#FFD000]' : 'bg-zinc-900 border-zinc-700'}`} />
        <div className={`w-11 h-11 rounded-full border-2 ${step >= 5? 'bg-[#FFD000] border-white shadow-[0_0_20px_#FFD000]' : 'bg-zinc-900 border-zinc-700'}`} />
      </div>
      <div className="flex flex-col gap-2">
        <div className={`w-11 h-11 rounded-full border-2 ${step === 6? 'bg-[#00FF00] border-white shadow-[0_0_30px_#00FF00]' : 'bg-zinc-900 border-zinc-700'}`} />
        <div className={`w-11 h-11 rounded-full border-2 ${step === 7? 'bg-[#E10600] border-white shadow-[0_0_30px_#E10600]' : 'bg-zinc-900 border-zinc-700'}`} />
      </div>
    </div>
  );
};




export default function TombolaClient({ tickets, adminKey }: { tickets: any[], adminKey: string }) {
  const [search, setSearch] = useState('');
  const [trackMoving, setTrackMoving] = useState(false);
  const [trafficLight, setTrafficLight] = useState(0); // 0=apagado 1-5=rojas prendidas 6=verde
const [gridReady, setGridReady] = useState(false);
const [trashTalk, setTrashTalk] = useState<{code:string, text:string} | null>(null);
const [greenTime, setGreenTime] = useState(0);
const PUTEADAS = ["TE PASO CTM!", "CHAO NOMAS", "MUY LENTO WN", "COME POLVO!", "PÁ' LA CASA", "QUIEN TE CONOCE?", "SACA LA CHALA", "JAJAJA"];
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
  const spacing = keep === 5? 16 : keep === 1? 0 : Math.min(5.5, 70 / (keep - 1));
  
  const totalWidth = (keep - 1) * spacing;
  const startX = keep === 5? 18 : 50 - totalWidth / 2;

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

const [treeStep, setTreeStep] = useState(0);

const startFinalRace = async () => {
  setAnimating(true);
  setFinalRaceActive(true);
  setTreeStep(0);
  setRaceProgress([]);
  setGreenTime(0);

  let order = shuffleReal(vivos);
  const gridX = [20, 35, 50, 65, 80];

  // VELOCIDAD CALCULADA PARA 40 SEGUNDOS REALES
  // Distancia 88 -> 6 = 82 unidades / (40000ms / 40ms = 1000 ticks) = 0.082 por tick
  const initial = order.map((r:any, i:number) => ({
  ...r,
    raceY: 88,
    raceX: gridX[i],
    targetX: gridX[i],
    baseSpeed: 0.065 + Math.random()*0.03, // 0.065 a 0.095 - LENTO
    speedJitter: Math.random()*0.015,
    pos: i+1,
    smoke: false,
    nitro: false,
    lastOvertake: 0,
    pathSeed: Math.random()*100,
    reaction: 0,
    reactionStart: 0,
    hasStarted: false,
  }));
  setRaceProgress(initial);

  // SEMAFORO
  setTreeStep(1); await new Promise(r=>setTimeout(r, 600));
  setTreeStep(2); try{ new Audio('/beep.mp3').play().catch(()=>{}) }catch{}; await new Promise(r=>setTimeout(r, 700));
  for(let i=3; i<=5; i++){ setTreeStep(i); try{ new Audio('/beep.mp3').play().catch(()=>{}) }catch{}; await new Promise(r=>setTimeout(r, 500)); }

  await new Promise(r=>setTimeout(r, 200 + Math.random()*600));
  const gTime = Date.now();
  setGreenTime(gTime);
  setTreeStep(6);
  setTrackMoving(true);
  try{ new Audio('/go.mp3').play().catch(()=>{}) }catch{}
  setCameraShake(true); setTimeout(()=>setCameraShake(false), 300);

  setRaceProgress(prev => prev.map(p => ({
  ...p,
    reactionStart: gTime + 80 + Math.random()*470,
    reaction: 0,
    hasStarted: false
  })));

  setTimeout(()=> setTreeStep(10), 2000);

  let elapsed = 0;
  const tick = 40;
  const duration = 40000; // 40 SEGUNDOS REALES

  const raceInterval = setInterval(() => {
    elapsed += tick;

    if(elapsed % 2500 < 50){
      const randomCode = raceProgress[Math.floor(Math.random()*5)]?.ticket_code;
      if(randomCode){
        setTrashTalk({ code: randomCode, text: PUTEADAS[Math.floor(Math.random()*PUTEADAS.length)] });
        setTimeout(()=> setTrashTalk(null), 1500);
      }
    }

    setRaceProgress(prev => {
      let next = prev.map(p => {
        const now = Date.now();
        if(!p.hasStarted){
          if(now >= p.reactionStart){
            return {...p, hasStarted: true, reaction: now - gTime, raceY: p.raceY - 0.1 };
          } else {
            return p;
          }
        }

        const wave = Math.sin(elapsed*0.001 + p.pathSeed) * p.speedJitter;
        let s = p.baseSpeed + wave;

        // Solo al final el primero se escapa un poco
        if((elapsed/duration) > 0.85 && p.pos === 1) s += 0.02;

        let newY = p.raceY - s;
        let newX = p.raceX;

        if(Math.random() < 0.012 && elapsed - p.lastOvertake > 3000 && p.pos > 1){
          p.targetX = 18 + Math.random()*64;
          p.lastOvertake = elapsed;
          p.smoke = true;
          setTimeout(()=>p.smoke=false, 600);
        }
        newX += (p.targetX - newX) * 0.02; // LERP SUAVE

        return {...p, raceY: newY, raceX: Math.max(15, Math.min(85, newX)), nitro: (elapsed/duration)>0.9 && p.pos===1 };
      });

      next.sort((a,b) => a.raceY - b.raceY);
      next = next.map((p,i)=>({...p, pos: i+1}));

      // AHORA TERMINA SOLO POR TIEMPO, NO POR CRUZAR ANTES
      if(elapsed >= duration || next[0].raceY <= 14){
        clearInterval(raceInterval);
        next.sort((a,b) => a.raceY - b.raceY);
        setTimeout(()=> finishRace(next[0], next), 400);
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
  setTrackMoving(false);
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
  <div className={`absolute inset-0 z-40 bg-[#0f0f0f] overflow-hidden ${cameraShake? 'animate-[shake_0.08s_ease_infinite]' : ''}`}>
    {/* ASFALTO EN MOVIMIENTO */}
    <div className="absolute inset-0 bg-[#181818]" />
    <div className="absolute inset-0 opacity-20" style={{
  backgroundImage: `linear-gradient(transparent 0%, transparent 96%, rgba(255,255,255,0.4) 96%, rgba(255,255,255,0.4) 100%)`,
  backgroundSize: '100% 80px',
  animation: trackMoving? 'roadMove 0.4s linear infinite' : 'none'
}} />
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`, backgroundSize: '28px 28px' }} />

    {/* BORDES */}
    <div className="absolute top-0 bottom-0 left-0 w-8 bg-[#2a2a2a] border-r-2 border-white z-20" />
    <div className="absolute top-0 bottom-0 right-0 w-8 bg-[#2a2a2a] border-l-2 border-white z-20" />
    
	
<div className="absolute top-0 bottom-0 left-0 w-3 z-30" style={{
  backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 12px, #E10600 12px, #E10600 24px)`,
  animation: trackMoving? 'roadMove 0.3s linear infinite' : 'none'
}} />    
	
<div className="absolute top-0 bottom-0 right-0 w-3 z-30" style={{
  backgroundImage: `repeating-linear-gradient(0deg, white 0px, white 12px, #E10600 12px, #E10600 24px)`,
  animation: trackMoving? 'roadMove 0.3s linear infinite' : 'none'
}} />
    {/* META */}
<div className="absolute top-[12%] left-8 right-8 h-7 z-30 rounded-sm" style={{ backgroundImage: `repeating-linear-gradient(90deg, white 0px, white 20px, black 20px, black 40px)`, boxShadow: `0 0 20px white` }} />    {/* LINEA CENTRAL */}
    
	
<div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] z-10 opacity-50" style={{
  backgroundImage: `repeating-linear-gradient(180deg, white 0px, white 20px, transparent 20px, transparent 40px)`,
  backgroundSize: '100% 80px',
  animation: trackMoving? 'roadMove 0.2s linear infinite' : 'none'
}} />
    {/* ARBOLITO */}
    <div className="absolute top-[9%] left-1/2 -translate-x-1/2 z-50">
      <DragTree step={treeStep >= 10? 6 : treeStep} fading={treeStep >= 10} />
    </div>

    {/* PANEL IZQ - POSICIONES MÁS CLARO Y CON NOMBRE */}
    <div className="absolute left-6 top-[20%] w-[240px] bg-black/45 backdrop-blur-md border border-zinc-600/50 rounded-2xl p-3 z-40 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="text- font-black tracking-[0.25em] text-white mb-3 flex items-center gap-2 border-b border-zinc-700 pb-2">
        <span className="w-2.5 h-2.5 bg-[#E10600] rounded-full animate-pulse" /> POSICIONES EN VIVO
      </div>
      {raceProgress.slice().sort((a,b)=>a.pos-b.pos).map((p:any)=>(
        <div key={p.ticket_code} className={`flex items-center gap-2.5 text- font-black py-2 px-3 rounded-xl mb-2 transition-all ${p.pos===1? 'bg-[#FFD000] text-black scale-[1.03] shadow-[0_0_15px_#FFD000]' : 'bg-zinc-800/90 text-white border border-zinc-700'}`}>
          <span className={`w-6 h-6 rounded-full grid place-items-center text- ${p.pos===1?'bg-black text-[#FFD000]':'bg-white text-black'}`}>{p.pos}°</span>
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background: p.color}} />
          <span className="truncate">{(p.nombre||p.name||'PILOTO').split(' ')[0].toUpperCase()}</span>
        </div>
      ))}
    </div>

    {/* PANEL DER - REACCIÓN MÁS CLARO Y CON NOMBRE */}
    <div className="absolute right-6 top-[20%] w-[220px] bg-black/45 backdrop-blur-md border border-zinc-600/50 rounded-2xl p-3 z-40 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
      <div className="text- font-black tracking-[0.25em] text-[#00FF88] mb-3 border-b border-zinc-700 pb-2">⚡ REACCIÓN SALIDA</div>
      {raceProgress.slice().sort((a,b)=>a.reaction-b.reaction).map((p:any)=>(
        <div key={p.ticket_code+'react'} className="flex justify-between items-center text- py-2 px-3 rounded-xl bg-zinc-800/90 border border-zinc-700 mb-2">
          <span className="text-white font-black truncate">{(p.nombre||p.name||'').split(' ')[0].toUpperCase()}</span>
          <span className={`font-mono font-black ${p.reaction===0? 'text-zinc-500' : p.reaction<200? 'text-[#00FF66]' : p.reaction<350? 'text-[#FFD000]' : 'text-[#FF4444]'}`}>
            {p.reaction===0? '...' : `${(p.reaction/1000).toFixed(3)}s`}
          </span>
        </div>
      ))}
      <div className="mt-2 text- text-zinc-500 text-center">* Tiempo desde verde hasta largar</div>
    </div>

    {/* AUTOS - MOVIMIENTO SUAVE */}
    {raceProgress.map((p:any)=>(
      <div key={p.ticket_code} className="absolute z-30" style={{ left: `${p.raceX}%`, top: `${p.raceY}%`, transform: 'translate(-50%,-50%)', transition: p.hasStarted? 'top 0.4s linear, left 1.2s ease-out' : 'all 0.8s ease-out' }}>
        {p.smoke && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-10 bg-white/15 blur-xl rounded-full" />}
        <CarSVG color={p.color} size={92} />
        <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 pointer-events-none">
          <div className="relative z-50 px-3 py-1 rounded-full bg-white text-black font-black text- tracking-widest shadow-[0_0_12px_white] whitespace-nowrap">
            {(p.nombre||p.name||'PILOTO').split(' ')[0].toUpperCase()}
          </div>
          <div className="relative z-50 px-2.5 py-0.5 rounded-full bg-black/90 border border-zinc-500 text-white font-mono font-black text- backdrop-blur whitespace-nowrap">
            {p.ticket_code}
          </div>
        </div>
        {/* PUTEADAS EN ROJO */}
        {trashTalk?.code === p.ticket_code && (
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-[60] bg-[#E10600] text-white font-black text- px-4 py-1.5 rounded-full border-2 border-white whitespace-nowrap animate-bounce shadow-[0_0_20px_#E10600]">
            {trashTalk.text}
          </div>
        )}
      </div>
    ))}

    <style jsx>{`
      @keyframes roadMove { 0% { background-position-y: 0; } 100% { background-position-y: 80px; } }
      @keyframes shake { 0%{transform:translate(1px,1px)} 50%{transform:translate(-1px,-1px)} 100%{transform:translate(1px,-1px)} }
    `}</style>
  </div>
)}



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
    const isLast5 = vivos.length === 5 &&!r.eliminated;
    const xPos = r.x?? (5 + (r.lane * 3.6));

    // SI QUEDAN 5 - VISTA NUEVA: NOMBRE ARRIBA / TICKET ABAJO
    if (isLast5) {
      const firstName = (r.nombre || r.name || 'PILOTO').split(' ')[0].toUpperCase();
      return (
        <div key={r.ticket_code} className="absolute z-30 transition-all duration-1000 ease-out" style={{ left: `${xPos}%`, top: `${r.y}%`, transform: 'translateX(-50%)' }}>
          <div className="flex flex-col items-center gap-2">
            {/* NOMBRE ARRIBA */}
           <div className="relative z-50 px-3 py-1 rounded-full bg-white text-black font-black text-[11px] tracking-widest shadow-[0_0_12px_white] whitespace-nowrap">
  {firstName}
</div>
<div className="relative z-10 my-2">
  <CarSVG color={r.color} eliminated={false} size={68} />
</div>
<div className="relative z-50 px-3 py-1 rounded-full bg-black/90 border border-zinc-600 text-white font-mono font-black text-[11px] backdrop-blur whitespace-nowrap">
  {r.ticket_code}
</div>
          </div>
        </div>
      );
    }

    // PARA LOS OTROS NIVELES (50,25,15) NORMAL SIN NADA
    return (
      <div key={r.ticket_code} className="absolute transition-all duration-1000 ease-out" style={{ left: `${xPos}%`, top: `${r.y}%`, transform: 'translateX(-50%)' }}>
        <CarSVG color={r.color} eliminated={r.eliminated} />
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
  <div className="fixed inset-0 bg-[#050505] z-[60] flex items-center justify-center p-2 md:p-4">
    <div className="bg-black w-full max-w-5xl rounded- border border-zinc-800 overflow-hidden flex flex-col max-h- shadow-[0_0_80px_rgba(225,6,0,0.25)]">

      {/* HEADER - SIN NUMEROS */}
      <div className="relative p-5 md:p-6 bg-gradient-to-b from-[#1a1a1a] to-black border-b-2 border-[#E10600] shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent_0px,transparent_20px,rgba(255,255,255,0.03)_20px,rgba(255,255,255,0.03)_21px)] pointer-events-none" />
        <div className="relative flex justify-between items-start gap-4">
          <div>
            {isShuffling? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#E10600] rounded-full animate-ping" />
                  <h2 className="font-black italic text-2xl md:text-3xl tracking-tighter leading-none">
                    CALENTANDO<span className="text-[#E10600]"> NEUMÁTICOS</span>
                  </h2>
                </div>
                <p className="mt-2 font-mono text- tracking-[0.3em] text-zinc-500 uppercase">
                  Revolviendo tickets • Crypto random 
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-[#FFD000] text-black font-black text- tracking-widest">PARRILLA DE LARGADA</span>
                  <span className="font-mono text-xs text-zinc-500">{random50.length} / 50 PILOTOS</span>
                </div>
                <h2 className="mt-2 font-black italic text-3xl md:text-4xl tracking-tighter leading-none">
                  50 <span className="text-zinc-600">ELEGIDOS</span> <span className="text-[#E10600]">AL AZAR</span>
                </h2>
                <p className="mt-1 font-mono text- tracking-[0.2em] text-zinc-500 uppercase">Desde la base total • Orden aleatorio verificado</p>
              </>
            )}
          </div>
          <div className={`px-4 py-1.5 rounded-full font-black text-sm border-2 shrink-0 ${isShuffling? 'bg-[#E10600] border-[#FF3333] text-white animate-pulse' : 'bg-white border-white text-black'}`}>
            {isShuffling? '🔥 MEZCLANDO...' : `⚡️ ${random50.length} / 50`}
          </div>
        </div>
      </div>

{/* CONTENIDO */}
      <div className="flex-1 bg-[#080808] relative overflow-hidden flex flex-col">
        {isShuffling? (
                    <div className="relative w-full flex-1 min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
            {/* VIDEO - AGRANDADO Y LIBRE */}
            <video
              src="/burn.mp4"
              autoPlay
              loop={false}
              
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover "
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-transparent" />

          {/* LAYOUT EN 3 PARTES - SEPARADO DE VERDAD */}
<div className="relative z-10 w-full h-full flex flex-col p-6 pt-2 pb-6">

  {/* LOGO BIEN ARRIBA */}
  <div className="flex justify-center shrink-0">
    <img
      src="/BB.png"
      alt="Balladares Motors"
      className="h- md:h- w-[350px] object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]"
    />
  </div>

  {/* ESPACIO GIGANTE PA QUE EL SKYLINE QUEDE SOLO - ESTE ES EL TRUCO */}
  <div className="flex-1 min-h-[220px] md:min-h-[300px]" />

  {/* TODO ABAJO BIEN SEPARADO */}
  <div className="flex flex-col items-center gap-3 shrink-0">
    <h1 className="font-black italic text-3xl md:text-4xl leading-[0.85] tracking-tighter text-white text-center [text-shadow:_0_0_30px_rgba(225,6,0,0.8)]">
      MEZCLANDO <span className="text-transparent" style={{ WebkitTextStroke: '1.5px white' }}>TÓMBOLA</span>
    </h1>

    <div className="flex items-center gap-2 bg-black/90 backdrop-blur border border-zinc-700 rounded-full px-5 py-2">
      <span className="w-2 h-2 bg-[#FFD000] rounded-full animate-pulse" />
      <span className="font-mono text- tracking-[0.3em] text-white uppercase">Barajando tickets • Aleatorio puro</span>
    </div>

    <div className="h-6 overflow-hidden opacity-60 w-full">
      <div className="animate-[marquee_0.6s_linear_infinite] flex gap-3 font-mono font-black text- text-white whitespace-nowrap">
        {display50.slice(0,10).map((t:any) => (
          <span key={t.ticket_code + Math.random()} className="px-2.5 py-1 bg-zinc-900/80 rounded-full border border-zinc-800">{t.ticket_code}</span>
        ))}
        {display50.slice(0,10).map((t:any) => (
          <span key={t.ticket_code + 'dup' + Math.random()} className="px-2.5 py-1 bg-zinc-900/80 rounded-full border border-zinc-800">{t.ticket_code}</span>
        ))}
      </div>
    </div>
  </div>
  
   



      </div>
    </div>
  ) : (
    /*... tu parte de los 50 igual... */
    <div className="p-4 md:p-5 overflow-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {random50.map((t:any, i:number) => (
          <div
            key={t.ticket_code}
            className="group relative h- rounded- bg-gradient-to-b from-[#1e1e1e] to-[#111] border border-zinc-800 flex items-center gap-2.5 px-3 overflow-hidden animate-[popIn_0.35s_ease_forwards] opacity-0 translate-y-3 hover:border-zinc-600 hover:scale-[1.02] transition-all"
            style={{ animationDelay: `${i * 18}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-7 h-7 rounded-full bg-black border border-zinc-700 grid place-items-center font-black text- text-zinc-400 group-hover:text-white group-hover:border-white transition-colors shrink-0">
              {i+1}
            </div>
            <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0" style={{ background: COLORS[i % COLORS.length], color: COLORS[i % COLORS.length] }} />
            <div className="flex-1 min-w-0">
              <div className="font-mono font-black text- leading-none text-white truncate">{t.ticket_code}</div>
              <div className="font-mono text- tracking-widest text-zinc-500 truncate uppercase mt-0.5">{(t.nombre || t.name || 'Piloto').split(' ')[0]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )}
</div>

      <div className="p-3 md:p-4 flex justify-between items-center bg-black border-t border-zinc-900 shrink-0">
        <button onClick={() => setShow50(false)} className="h-10 px-5 rounded-full bg-zinc-900 border border-zinc-800 text-white font-black text-xs tracking-widest hover:bg-zinc-800 transition-colors">✕ CERRAR</button>
        <div className="flex gap-2">
          <button onClick={get50Random} disabled={isShuffling} className="h-10 px-5 rounded-full bg-zinc-900 border border-zinc-800 text-white font-black text-xs tracking-widest hover:bg-white hover:text-black transition-colors disabled:opacity-20">🎲 MEZCLAR OTRA VEZ</button>
          <button onClick={cargar50EnPista} disabled={isShuffling} className="h-10 px-6 rounded-full bg-[#E10600] border border-[#FF3333] text-white font-black text-xs tracking-widest shadow-[0_0_20px_rgba(225,6,0,0.4)] hover:shadow-[0_0_30px_rgba(225,6,0,0.6)] hover:scale-[1.02] transition-all disabled:opacity-20">🏁 CARGAR {isShuffling? '...' : `${random50.length} EN PISTA`}</button>
        </div>
      </div>
    </div>
    <style jsx>{`
      @keyframes popIn { to { opacity: 1; transform: translateY(0); } }
      @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
    `}</style>
  </div>
)}

     
    </div>
  );
}