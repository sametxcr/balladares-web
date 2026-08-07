"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string, pcHeight?: string }){

  const pressKey = (code: string, keyCode: number, type: "down"|"up") => {
    const e = new KeyboardEvent(type === "down"? "keydown" : "keyup", {
      key, code, keyCode, which: keyCode, bubbles: true, cancelable: true
    });
    // Se lo tiramos a todo para que lo agarre si o si
    window.dispatchEvent(e);
    document.dispatchEvent(e);
    document.getElementById("game")?.dispatchEvent(e);
  };

  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
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

        <div className="w-full border-y-2 md:border-2 border-white bg-black relative">
          <div id="game" className="w-full" />

          {/* BOTONES CELU */}
          <div className="md:hidden absolute bottom-3 left-0 right-0 px-3 flex justify-between items-end">
            <div className="flex gap-3">
              <button
                onTouchStart={()=>pressKey("ArrowLeft","ArrowLeft",37,"down")}
                onTouchEnd={()=>pressKey("ArrowLeft","ArrowLeft",37,"up")}
                className="w-16 h-16 bg-black/70 border-2 border-white text-white font-black rounded-full active:bg-red-600 text-xl">◀</button>
              <button
                onTouchStart={()=>pressKey("ArrowRight","ArrowRight",39,"down")}
                onTouchEnd={()=>pressKey("ArrowRight","ArrowRight",39,"up")}
                className="w-16 h-16 bg-black/70 border-2 border-white text-white font-black rounded-full active:bg-red-600 text-xl">▶</button>
            </div>

            <div className="flex flex-col gap-2 items-end">
              <div className="flex gap-2">
                <button
                  onTouchStart={()=>pressKey("Digit5","5",53,"down")}
                  onTouchEnd={()=>pressKey("Digit5","5",53,"up")}
                  onMouseDown={()=>pressKey("Digit5","5",53,"down")}
                  onMouseUp={()=>pressKey("Digit5","5",53,"up")}
                  className="px-4 py-2 bg-yellow-400 text-black font-black text-xs rounded shadow-[2px_2px_0px_white] active:scale-95">5 = FICHA</button>
                <button
                  onTouchStart={()=>pressKey("Digit1","1",49,"down")}
                  onTouchEnd={()=>pressKey("Digit1","1",49,"up")}
                  onMouseDown={()=>pressKey("Digit1","1",49,"down")}
                  onMouseUp={()=>pressKey("Digit1","1",49,"up")}
                  className="px-4 py-2 bg-white text-black font-black text-xs rounded shadow-[2px_2px_0px_red] active:scale-95">1 = START</button>
              </div>
              <div className="flex gap-2">
                <button onTouchStart={()=>pressKey("ArrowDown","ArrowDown",40,"down")} onTouchEnd={()=>pressKey("ArrowDown","ArrowDown",40,"up")} className="w-16 h-12 bg-black/70 border border-white text-white font-black text-xs rounded active:bg-red-600">FRENO</button>
                <button onTouchStart={()=>pressKey("ArrowUp","ArrowUp",38,"down")} onTouchEnd={()=>pressKey("ArrowUp","ArrowUp",38,"up")} className="w-24 h-14 bg-red-600 border-2 border-white text-white font-black rounded active:bg-white active:text-black">ACELERA</button>
              </div>
            </div>
          </div>
        </div>
        <p className="text-white/40 text- mt-2 text-center">En PC: 5 = ficha, 1 = start, flechas = mover</p>
      </section>
    </>
  )
}