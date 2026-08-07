"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const send = (key: string, code: string, keyCode: number, type: "down"|"up") => {
    const canvas = document.querySelector("#game canvas") as any;
    if (canvas) canvas.focus();

    const event = new KeyboardEvent(type === "down"? "keydown" : "keyup", {
      key, code, keyCode, which: keyCode, bubbles: true, cancelable: true,
    } as any);

    // Lo tiramos por todos lados hasta que lo pesque
    window.dispatchEvent(event);
    document.dispatchEvent(event);
    canvas?.dispatchEvent(event);

    // Y directo al FBNeo
    try {
      const emu = (window as any).EJS_emulator;
      emu?.gameManager?.keyboard?.onKeyDown?.({ keyCode, code, key });
      emu?.gameManager?.keyboard?.toggleKey?.(keyCode, type === "down"? 1 : 0);
      if (type === "down") emu?.keyDown?.(keyCode);
      else emu?.keyUp?.(keyCode);
    } catch {}
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
        <h2 className="text-white font-black italic text-2xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full border-y-2 md:border-2 border-white bg-black">
          <div id="game" className="w-full" />
        </div>

        {/* BOTONERA CHICA - AHORA SI RESPONDE */}
        <div className="md:hidden w-full bg-[#111] border-b border-white/20 p-2 flex flex-col gap-2">

          <div className="grid grid-cols-2 gap-2">
            <button type="button"
              onTouchStart={()=>send("v","KeyV",86,"down")} onTouchEnd={()=>send("v","KeyV",86,"up")}
              onMouseDown={()=>send("v","KeyV",86,"down")} onMouseUp={()=>send("v","KeyV",86,"up")}
              className="py-2.5 bg-yellow-400 text-black font-black text-sm rounded active:scale-95">V = FICHA</button>

            <button type="button"
              onTouchStart={()=>send("Enter","Enter",13,"down")} onTouchEnd={()=>send("Enter","Enter",13,"up")}
              onMouseDown={()=>send("Enter","Enter",13,"down")} onMouseUp={()=>send("Enter","Enter",13,"up")}
              className="py-2.5 bg-white text-black font-black text-sm rounded active:scale-95">ENTER = START</button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button type="button"
                onTouchStart={()=>send("ArrowLeft","ArrowLeft",37,"down")} onTouchEnd={()=>send("ArrowLeft","ArrowLeft",37,"up")}
                onMouseDown={()=>send("ArrowLeft","ArrowLeft",37,"down")} onMouseUp={()=>send("ArrowLeft","ArrowLeft",37,"up")}
                className="w-12 h-12 bg-black border border-white/50 text-white rounded-full active:bg-red-600">◀</button>
              <button type="button"
                onTouchStart={()=>send("ArrowRight","ArrowRight",39,"down")} onTouchEnd={()=>send("ArrowRight","ArrowRight",39,"up")}
                onMouseDown={()=>send("ArrowRight","ArrowRight",39,"down")} onMouseUp={()=>send("ArrowRight","ArrowRight",39,"up")}
                className="w-12 h-12 bg-black border border-white/50 text-white rounded-full active:bg-red-600">▶</button>
            </div>

            <div className="flex gap-2 items-center">
              <button type="button"
                onTouchStart={()=>send("z","KeyZ",90,"down")} onTouchEnd={()=>send("z","KeyZ",90,"up")}
                onMouseDown={()=>send("z","KeyZ",90,"down")} onMouseUp={()=>send("z","KeyZ",90,"up")}
                className="w-12 h-10 bg-zinc-800 border border-white/30 text-white font-bold text- rounded">Z</button>
              <button type="button"
                onTouchStart={()=>send("x","KeyX",88,"down")} onTouchEnd={()=>send("x","KeyX",88,"up")}
                onMouseDown={()=>send("x","KeyX",88,"down")} onMouseUp={()=>send("x","KeyX",88,"up")}
                className="w-16 h-12 bg-red-600 border border-white text-white font-black rounded active:bg-white active:text-black">X</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}