"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const down = (key: string, code: string, keyCode: number) => {
    try {
      const emu = (window as any).EJS_emulator;
      if (emu?.gameManager?.keyboard) emu.gameManager.keyboard.toggleKey(keyCode, 1);
    } catch {}
    const ev = new KeyboardEvent("keydown", { key, code, keyCode, which: keyCode, bubbles: true } as any);
    window.dispatchEvent(ev);
    document.dispatchEvent(ev);
  };
  const up = (key: string, code: string, keyCode: number) => {
    try {
      const emu = (window as any).EJS_emulator;
      if (emu?.gameManager?.keyboard) emu.gameManager.keyboard.toggleKey(keyCode, 0);
    } catch {}
    const ev = new KeyboardEvent("keyup", { key, code, keyCode, which: keyCode, bubbles: true } as any);
    window.dispatchEvent(ev);
    document.dispatchEvent(ev);
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
       .btn-arcade { touch-action: manipulation; user-select: none; }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full relative border-y-2 md:border-2 border-white bg-black">
          <div id="game" className="w-full" />

          <div className="md:hidden absolute bottom-0 left-0 right-0 z-[50] p-2 bg-gradient-to-t from-black/90 to-transparent pointer-events-none">
            <div className="flex justify-between items-end pointer-events-auto">

              {/* IZQUIERDA */}
              <div className="flex gap-2">
                <button className="btn-arcade w-16 h-16 bg-black/80 border-2 border-white text-white text-xl font-black rounded-full active:bg-red-600"
                  onTouchStart={(e)=>{e.preventDefault(); down("ArrowLeft","ArrowLeft",37)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowLeft","ArrowLeft",37)}}>◀</button>
                <button className="btn-arcade w-16 h-16 bg-black/80 border-2 border-white text-white text-xl font-black rounded-full active:bg-red-600"
                  onTouchStart={(e)=>{e.preventDefault(); down("ArrowRight","ArrowRight",39)}} onTouchEnd={(e)=>{e.preventDefault(); up("ArrowRight","ArrowRight",39)}}>▶</button>
              </div>

              {/* DERECHA */}
              <div className="flex flex-col gap-2 items-end">
                <div className="flex gap-2">
                  <button className="btn-arcade px-3 py-2 bg-yellow-400 text-black font-black text-xs rounded"
                    onTouchStart={(e)=>{e.preventDefault(); down("v","KeyV",86)}} onTouchEnd={(e)=>{e.preventDefault(); up("v","KeyV",86)}}
                    onMouseDown={()=>down("v","KeyV",86)} onMouseUp={()=>up("v","KeyV",86)}>V=FICHA</button>

                  <button className="btn-arcade px-3 py-2 bg-white text-black font-black text-xs rounded"
                    onTouchStart={(e)=>{e.preventDefault(); down("Enter","Enter",13)}} onTouchEnd={(e)=>{e.preventDefault(); up("Enter","Enter",13)}}
                    onMouseDown={()=>down("Enter","Enter",13)} onMouseUp={()=>up("Enter","Enter",13)}>ENTER=START</button>
                </div>

                <div className="flex gap-2">
                  <button className="btn-arcade w-14 h-12 bg-black/80 border border-white text-white font-bold text- rounded"
                    onTouchStart={(e)=>{e.preventDefault(); down("z","KeyZ",90)}} onTouchEnd={(e)=>{e.preventDefault(); up("z","KeyZ",90)}}
                    onMouseDown={()=>down("z","KeyZ",90)} onMouseUp={()=>up("z","KeyZ",90)}>Z=TURBO</button>

                  <button className="btn-arcade w-24 h-14 bg-red-600 border-2 border-white text-white font-black rounded"
                    onTouchStart={(e)=>{e.preventDefault(); down("x","KeyX",88)}} onTouchEnd={(e)=>{e.preventDefault(); up("x","KeyX",88)}}
                    onMouseDown={()=>down("x","KeyX",88)} onMouseUp={()=>up("x","KeyX",88)}>X=ACELERA</button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <p className="text-white/30 text- mt-2">PC: V=Ficha, Enter=Start, X=Acelera, Z=Turbo</p>
      </section>
    </>
  );
}