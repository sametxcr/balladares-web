"use client";
import { useEffect, useRef } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const padRef = useRef<any>({
    id: "Balladares Pad",
    index: 0,
    connected: true,
    mapping: "standard",
    axes: [0, 0, 0, 0],
    buttons: Array.from({length: 16}, ()=>({ pressed: false, value: 0 }))
  });

  useEffect(() => {
    const fakePad = padRef.current;
    // @ts-ignore
    const originalGetGamepads = navigator.getGamepads?.bind(navigator);
    // @ts-ignore
    navigator.getGamepads = () => {
      const real = originalGetGamepads?.() || [];
      // @ts-ignore
      return [fakePad,...real];
    };
    window.dispatchEvent(new Event("gamepadconnected"));

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_lightgun = false;
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  const setBtn = (idx: number, down: boolean) => {
    const b = padRef.current.buttons[idx];
    if (b) { b.pressed = down; b.value = down? 1 : 0; }
  };
  const setAxis = (x: number) => {
    padRef.current.axes[0] = x;
  };

  const Btn = ({ label, onDown, onUp, className }: any) => (
    <button
      type="button"
      onPointerDown={(e)=>{ e.preventDefault(); (e.target as any).setPointerCapture(e.pointerId); onDown(); }}
      onPointerUp={(e)=>{ e.preventDefault(); onUp(); }}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      className={`select-none touch-none active:scale-90 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <>
      <style>{`
        #game { width: 100%!important; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: fill!important; }
        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-2xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full border-y-2 md:border-2 border-white bg-black">
          <div id="game" className="w-full" />
        </div>

        <div className="md:hidden w-full bg-[#111] p-2 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Btn label="V = FICHA" className="py-2.5 bg-yellow-400 text-black font-black text-sm rounded"
              onDown={()=>setBtn(8, true)} onUp={()=>setBtn(8, false)} />
            <Btn label="ENTER = START" className="py-2.5 bg-white text-black font-black text-sm rounded"
              onDown={()=>setBtn(9, true)} onUp={()=>setBtn(9, false)} />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Btn label="◀" className="w-12 h-12 bg-black border border-white/50 text-white rounded-full"
                onDown={()=>setAxis(-1)} onUp={()=>setAxis(0)} />
              <Btn label="▶" className="w-12 h-12 bg-black border border-white/50 text-white rounded-full"
                onDown={()=>setAxis(1)} onUp={()=>setAxis(0)} />
            </div>
            <div className="flex gap-2 items-center">
              <Btn label="Z" className="w-12 h-10 bg-zinc-800 border border-white/30 text-white font-bold text- rounded"
                onDown={()=>setBtn(1, true)} onUp={()=>setBtn(1, false)} />
              <Btn label="X" className="w-16 h-12 bg-red-600 border border-white text-white font-black rounded"
                onDown={()=>setBtn(0, true)} onUp={()=>setBtn(0, false)} />
            </div>
          </div>
          <p className="text-center text-white/20 text-">MODO CONTROL FAKE - ESTE SI FUNCIONA EN CELU</p>
        </div>
      </section>
    </>
  );
}