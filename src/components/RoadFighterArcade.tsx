"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  const holdKey = (keyCode: number, isDown: boolean) => {
    try {
      const emu = (window as any).EJS_emulator;
      // 3 formas de pegarle al fbneo, una tiene que pescar
      if (emu) {
        if (emu.gameManager?.keyboard) {
          emu.gameManager.keyboard.toggleKey?.(keyCode, isDown? 1 : 0);
          emu.gameManager.keyboard.keys && (emu.gameManager.keyboard.keys[keyCode] = isDown? 1 : 0);
        }
        if (isDown) emu.keyDown?.(keyCode);
        else emu.keyUp?.(keyCode);
        // Para cores viejos
        emu.onKeyDown?.(keyCode);
        emu.onKeyUp?.(keyCode);
      }
    } catch {}

    // Por si acaso también mandamos el evento normal
    const canvas = document.querySelector("#game canvas") as any;
    const type = isDown? "keydown" : "keyup";
    const ev = new KeyboardEvent(type, { keyCode, which: keyCode, bubbles: true } as any);
    window.dispatchEvent(ev);
    canvas?.dispatchEvent(ev);
  };

  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    // Desactivamos el gamepad nativo que tapa todo
    (window as any).EJS_gamepad = false;
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  const Btn = ({ label, keyCode, className }: { label: string, keyCode: number, className: string }) => (
    <button
      type="button"
      onPointerDown={(e)=>{ e.preventDefault(); (e.target as any).setPointerCapture(e.pointerId); holdKey(keyCode, true); }}
      onPointerUp={(e)=>{ e.preventDefault(); holdKey(keyCode, false); }}
      onPointerCancel={(e)=>{ holdKey(keyCode, false); }}
      onPointerLeave={(e)=>{ holdKey(keyCode, false); }}
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

        <div className="md:hidden w-full bg-[#111] border-b border-white/20 p-2 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <Btn label="V = FICHA" keyCode={86} className="py-2.5 bg-yellow-400 text-black font-black text-sm rounded" />
            <Btn label="ENTER = START" keyCode={13} className="py-2.5 bg-white text-black font-black text-sm rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Btn label="◀" keyCode={37} className="w-12 h-12 bg-black border border-white/50 text-white rounded-full" />
              <Btn label="▶" keyCode={39} className="w-12 h-12 bg-black border border-white/50 text-white rounded-full" />
            </div>
            <div className="flex gap-2 items-center">
              <Btn label="Z" keyCode={90} className="w-12 h-10 bg-zinc-800 border border-white/30 text-white font-bold text- rounded" />
              <Btn label="X" keyCode={88} className="w-16 h-12 bg-red-600 border border-white text-white font-black rounded" />
            </div>
          </div>
          <p className="text-center text-white/20 text-">MANTEN X PRESIONADO - PRUEBA EN HTTPS</p>
        </div>
      </section>
    </>
  );
}