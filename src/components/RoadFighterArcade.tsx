"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const down = (key: string, code: string, keyCode: number) => {
    try { (window as any).EJS_emulator?.gameManager?.keyboard?.toggleKey(keyCode, 1); } catch {}
    window.dispatchEvent(new KeyboardEvent("keydown", { key, code, keyCode, bubbles: true } as any));
  };
  const up = (key: string, code: string, keyCode: number) => {
    try { (window as any).EJS_emulator?.gameManager?.keyboard?.toggleKey(keyCode, 0); } catch {}
    window.dispatchEvent(new KeyboardEvent("keyup", { key, code, keyCode, bubbles: true } as any));
  };

  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        #game { width: 100%!important; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: fill!important; }
        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full border-y-2 md:border-2 border-white bg-black">
          <div id="game" className="w-full" />
        </div>

        {/* BOTONERA ABAJO - AHORA SI SE PUEDE PRESIONAR */}
        <div className="md:hidden w-full bg-zinc-900 border-b-2 border-white p-3 flex flex-col gap-3">

          <div className="grid grid-cols-2 gap-3">
            <button type="button"
              onTouchStart={()=>down("v","KeyV",86)} onTouchEnd={()=>up("v","KeyV",86)}
              onMouseDown={()=>down("v","KeyV",86)} onMouseUp={()=>up("v","KeyV",86)}
              className="w-full py-4 bg-yellow-400 text-black font-black text-lg rounded active:scale-95">V = FICHA</button>

            <button type="button"
              onTouchStart={()=>down("Enter","Enter",13)} onTouchEnd={()=>up("Enter","Enter",13)}
              onMouseDown={()=>down("Enter","Enter",13)} onMouseUp={()=>up("Enter","Enter",13)}
              className="w-full py-4 bg-white text-black font-black text-lg rounded active:scale-95">ENTER = START</button>
          </div>

          <div className="flex justify-between items-center gap-3">
            <div className="flex gap-3">
              <button type="button" onTouchStart={()=>down("ArrowLeft","ArrowLeft",37)} onTouchEnd={()=>up("ArrowLeft","ArrowLeft",37)} className="w-20 h-20 bg-black border-2 border-white text-white text-3xl font-black rounded-full active:bg-red-600">◀</button>
              <button type="button" onTouchStart={()=>down("ArrowRight","ArrowRight",39)} onTouchEnd={()=>up("ArrowRight","ArrowRight",39)} className="w-20 h-20 bg-black border-2 border-white text-white text-3xl font-black rounded-full active:bg-red-600">▶</button>
            </div>

            <div className="flex gap-3 items-end">
              <button type="button" onTouchStart={()=>down("z","KeyZ",90)} onTouchEnd={()=>up("z","KeyZ",90)} className="w-16 h-16 bg-zinc-700 border border-white text-white font-black text-xs rounded active:bg-white active:text-black">Z<br/>TURBO</button>
              <button type="button" onTouchStart={()=>down("x","KeyX",88)} onTouchEnd={()=>up("x","KeyX",88)} className="w-24 h-20 bg-red-600 border-2 border-white text-white font-black text-lg rounded shadow-[4px_4px_0px_black] active:scale-95">X</button>
            </div>
          </div>
          <p className="text-center text-white/30 text-">MANTEN PRESIONADO X PARA ACELERAR</p>
        </div>
      </section>
    </>
  );
}