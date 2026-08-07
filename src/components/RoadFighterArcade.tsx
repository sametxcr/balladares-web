"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string, pcHeight?: string }){

  const press = (key: string, type: "down"|"up") => {
    window.dispatchEvent(new KeyboardEvent(type === "down"? "keydown" : "keyup", { key, code: key, keyCode: key === "ArrowLeft"? 37 : key === "ArrowRight"? 39 : key === "ArrowUp"? 38 : key === "ArrowDown"? 40 : key === "Enter"? 13 : 49, bubbles: true }));
  };

  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_Buttons = {}; // desactivamos los feos
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return ()=>{ if(document.body.contains(s)) document.body.removeChild(s); };
  },[]);

  return (
    <>
      <style>{`
        #game { width: 100%!important; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: fill!important; }
        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-1">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
        <p className="text-white/40 text- mb-2">MONEDA = ENTER | START = 1 | CELU = BOTONES ABAJO</p>

        <div className="w-full border-y-2 md:border-2 border-white bg-black relative">
          <div id="game" className="w-full" />

          {/* BOTONES PARA CELULAR - SOLO SE VEN EN CELU */}
          <div className="md:hidden absolute bottom-2 left-0 right-0 px-2 flex justify-between items-end pointer-events-none">
            <div className="flex gap-2 pointer-events-auto">
              <button onTouchStart={()=>press("ArrowLeft","down")} onTouchEnd={()=>press("ArrowLeft","up")} className="w-14 h-14 bg-white/20 backdrop-blur border border-white text-white font-black rounded-full active:bg-red-600">◀</button>
              <button onTouchStart={()=>press("ArrowRight","down")} onTouchEnd={()=>press("ArrowRight","up")} className="w-14 h-14 bg-white/20 backdrop-blur border border-white text-white font-black rounded-full active:bg-red-600">▶</button>
            </div>
            <div className="flex flex-col gap-2 pointer-events-auto">
              <div className="flex gap-2 justify-end">
                <button onTouchStart={()=>press("Enter","down")} onTouchEnd={()=>press("Enter","up")} className="px-3 py-1 bg-yellow-500 text-black font-black text- rounded">COIN</button>
                <button onTouchStart={()=>press("1","down")} onTouchEnd={()=>press("1","up")} className="px-3 py-1 bg-white text-black font-black text- rounded">START</button>
              </div>
              <div className="flex gap-2">
                <button onTouchStart={()=>press("ArrowDown","down")} onTouchEnd={()=>press("ArrowDown","up")} className="w-14 h-10 bg-white/20 border border-white text-white font-black text-xs rounded active:bg-red-600">FRENO</button>
                <button onTouchStart={()=>press("ArrowUp","down")} onTouchEnd={()=>press("ArrowUp","up")} className="w-20 h-14 bg-red-600 border-2 border-white text-white font-black rounded active:bg-white active:text-black">ACELERA</button>
              </div>
            </div>
          </div>
        </div>

        <p className="md:hidden text-white/30 text- mt-2">Si no acelera, toca ACELERA y mantenlo presionado</p>
      </section>
    </>
  )
}