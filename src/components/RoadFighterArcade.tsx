"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const down = (k: string, code: number) => {
    // Truco para FBNeo: mandarlo directo al emulador si existe
    try {
      const emu = (window as any).EJS_emulator;
      if (emu?.gameManager?.keyboard) {
        emu.gameManager.keyboard.toggleKey(code, 1);
      }
    } catch {}
    const ev = new KeyboardEvent("keydown", { key: k, code: k, keyCode: code, which: code, bubbles: true } as any);
    window.dispatchEvent(ev);
  };
  const up = (k: string, code: number) => {
    try {
      const emu = (window as any).EJS_emulator;
      if (emu?.gameManager?.keyboard) {
        emu.gameManager.keyboard.toggleKey(code, 0);
      }
    } catch {}
    const ev = new KeyboardEvent("keyup", { key: k, code: k, keyCode: code, which: code, bubbles: true } as any);
    window.dispatchEvent(ev);
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
       .btn-arcade { touch-action: manipulation; user-select: none; -webkit-user-select: none; }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full relative border-y-2 md:border-2 border-white bg-black">
          <div id="game" className="w-full" />

          {/* BOTONES - AHORA CON Z-50 Y FUERA DEL CANVAS */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[50] p-2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
            <div className="flex justify-between items-end pointer-events-auto">
              <div className="flex gap-2">
                <button className="btn-arcade w-16 h-16 bg-black/80 border-2 border-white text-xl font-black rounded-full active:bg-red-600"
                  onTouchStart={(e)=>{e.preventDefault(); down("ArrowLeft",37)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowLeft",37)}}
                  onMouseDown={()=>down("ArrowLeft",37)} onMouseUp={()=>up("ArrowLeft",37)}>◀</button>
                <button className="btn-arcade w-16 h-16 bg-black/80 border-2 border-white text-white text-xl font-black rounded-full active:bg-red-600"
                  onTouchStart={(e)=>{e.preventDefault(); down("ArrowRight",39)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowRight",39)}}
                  onMouseDown={()=>down("ArrowRight",39)} onMouseUp={()=>up("ArrowRight",39)}>▶</button>
              </div>

              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button className="btn-arcade px-4 py-2 bg-yellow-400 text-black font-black text-xs rounded active:scale-90"
                    onTouchStart={(e)=>{e.preventDefault(); down("5",53)}} onTouchEnd={(e)=>{e.preventDefault(); up("5",53)}}
                    onMouseDown={()=>down("5",53)} onMouseUp={()=>up("5",53)}>5=FICHA</button>
                  <button className="btn-arcade px-4 py-2 bg-white text-black font-black text-xs rounded active:scale-90"
                    onTouchStart={(e)=>{e.preventDefault(); down("1",49)}} onTouchEnd={(e)=>{e.preventDefault(); up("1",49)}}
                    onMouseDown={()=>down("1",49)} onMouseUp={()=>up("1",49)}>1=START</button>
                </div>
                <div className="flex gap-2">
                  <button className="btn-arcade w-16 h-12 bg-black/80 border border-white text-white font-bold text-xs rounded"
                    onTouchStart={(e)=>{e.preventDefault(); down("ArrowDown",40)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowDown",40)}}>FRENO</button>
                  <button className="btn-arcade w-24 h-14 bg-red-600 border-2 border-white text-white font-black rounded active:bg-white active:text-black"
                    onTouchStart={(e)=>{e.preventDefault(); down("ArrowUp",38)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowUp",38)}}
                    onMouseDown={()=>down("ArrowUp",38)} onMouseUp={()=>up("ArrowUp",38)}>ACELERA</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}