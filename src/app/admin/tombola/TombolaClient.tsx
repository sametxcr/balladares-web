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

 const get50Random = () => {
  setShow50(true);
  setIsShuffling(true);
  setDisplay50([]);

  // sonido opcional - si no tienes el mp3 no se cae
  

  let ticks = 0;
  const interval = setInterval(() => {
    const fake = [...tickets].sort(() => Math.random() - 0.5).slice(0, 50);
    setDisplay50(fake);
    ticks++;
    if (ticks > 60) { // 3.5 segundos de suspenso
      clearInterval(interval);
      const finalFifty = [...tickets].sort(() => Math.random() - 0.5).slice(0, 50);
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
  if (animating || ronda >= 4 || countdown!== null) return;

  // suena UNA vez los 5 seg
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
  setAnimating(true);
  const alive = racers.filter(r =>!r.eliminated);
  const nextConfig = rondasConfig[ronda + 1];
  let keep = nextConfig?.count || 1;

  let current = alive.length; const target = keep;
  const interval = setInterval(() => { current = Math.max(target, current - Math.ceil((current - target) / 4) - 1); setSlotCount(current); if (current <= target) clearInterval(interval); }, 60);
  await new Promise(r => setTimeout(r, 800));

  const shuffled = [...alive].sort(() => Math.random() - 0.5);
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
  if (keep === 1) {
    setWinner(survivorsList[0]);
    setTimeout(() => {
      setIsFinalCelebration(true);
      try { new Audio('/fireworks.mp3').play().catch(()=>{}) } catch {}
      setTimeout(() => setShow(true), 3000);
    }, 1100);
  }
};

  const reset = () => {
  setActivePool(null); // 👈 vacía la pista
  setRandom50([]);
  setRacers([]); // 👈 borra todos los autos
  setRonda(0);
  setWinner(null);
  setShow(false);
  setShow50(false);
  setSlotCount(0);
  setSearch('');
};

  return (
    <div className="h-screen w-screen bg-[#080808] text-white flex flex-col overflow-hidden">
      <div className="h-12 flex items-center justify-between px-3 bg-gradient-to-b from-[#1a1a1a] to-[#000] border-b-2 border-[#E10600] shrink-0 z-20">
  <div className="flex items-center gap-3 shrink-0">
    <div className="flex items-center gap-1.5 bg-gradient-to-b from-[#E10600] to-[#B00000] text-white px-3 py-1 rounded-full font-black border border-[#FF3333] text-xs">📹 EN VIVO <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /></div>
    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar BM..." className="w-44 h-8 bg-[#1a1a1a] border border-zinc-700 rounded-full px-4 text-xs font-mono outline-none" />
    <div className="hidden md:flex items-center gap-2 text- font-mono text-zinc-400 tracking-widest border border-zinc-800 rounded-full px-3 py-1 bg-black">
      BALLADARES MOTORS © 2026 • <span className="text-white font-black">{tickets.length} tickets en BD</span>
    </div>
  </div>
  <button onClick={get50Random} className="h-8 px-8 rounded-full bg-gradient-to-b from-[#FFD000] to-[#FFB000] text-black font-black text-xs border border-[#FFD000]">🎲 TRAER 50 AL AZAR</button>
  <div className="flex gap-1.5 shrink-0">
<button onClick={reset} className="h-8 px-8 rounded-full bg-white text-black text-xs font-black">↻ RESET</button>
    <Link href={`/admin/tickets`} className="h-8 px-3 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-black grid place-items-center">VOLVER</Link>
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

  {/* BORDES LATERALES TIPO PISTA */}
  <div className="absolute top-0 left-0 w-3 h-full bg-[repeating-linear-gradient(0deg,white_0px,white_12px,red_12px,red_24px)] opacity-60" />
  <div className="absolute top-0 right-0 w-3 h-full bg-[repeating-linear-gradient(0deg,white_0px,white_12px,red_12px,red_24px)] opacity-60" />

  {/* LINEA DE META ARRIBA */}
  <div className="absolute top-0 left-0 right-0 h-4 bg-[repeating-linear-gradient(90deg,white_0px,white_20px,black_20px,black_40px)] border-b-2 border-white/50 z-20" />

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

  {racers.map((r:any) => {
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

           <div className="h-10 bg-black border-t-2 border-[#E10600] flex items-center overflow-hidden shrink-0 relative">

  <div className="flex-1 overflow-hidden">
    <div
      style={{ animation: 'marquee 15s linear infinite' }}
      className="flex w-max gap-12 whitespace-nowrap items-center"
    >
      <span className="text-white font-black text-xs tracking-[0.3em]">🏁 BALLADARES MOTORS</span>
      <span className="text-zinc-500 font-black text-xs">R33 • R34 • SUPRA • SILVIA • 350Z • 370Z</span>
      <span className="text-[#FFD000] font-black text-xs tracking-[0.3em]">TALLER • LUBRICENTRO • DETAILING</span>
      <span className="text-white font-black text-xs tracking-[0.3em]">🏁 BALLADARES MOTORS</span>
      <span className="text-zinc-500 font-black text-xs">R33 • R34 • SUPRA • SILVIA • 350Z • 370Z</span>
      <span className="text-[#FFD000] font-black text-xs tracking-[0.3em]">TALLER • LUBRICENTRO • DETAILING</span>
      <span className="text-white font-black text-xs tracking-[0.3em]">🏁 BALLADARES MOTORS</span>
      <span className="text-zinc-500 font-black text-xs">R33 • R34 • SUPRA • SILVIA • 350Z • 370Z</span>
    </div>
  </div>

  <button
  onClick={handleNextClick}
  disabled={racers.length === 0 || vivos.length === 0 || animating || countdown!== null}
  className={`h-full px-6 font-black text-xs shrink-0 ml-2 transition-all ${
    racers.length === 0 || vivos.length === 0
     ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
      : 'bg-white text-black hover:bg-[#FFD000]'
  }`}
>
  {racers.length === 0? '⚠️ CARGA AUTOS' : `▶ ${rondasConfig[ronda]?.label} → ${rondasConfig[ronda + 1]?.count?? 1}`}
</button>

  <style jsx global>{`
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
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