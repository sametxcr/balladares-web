"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string; pcHeight?: string }) {

  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;

    (window as any).EJS_settings = {
      volume: 0.5,
    };
    (window as any).EJS_virtualGamepad = true;
    (window as any).EJS_virtualGamepadSettings = {
      type: "arcade"
    };
    (window as any).EJS_mobileControls = true;

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
       .ejs-virtual-gamepad-button { opacity: 0.9!important; }
        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-2xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>

        <div className="w-full border-y-2 md:border-2 border-white bg-black relative">
          <div id="game" className="w-full" />

          <div className="md:hidden absolute bottom-1 left-0 right-0 z-10 pointer-events-none flex flex-col gap-1 px-1">
            <div className="grid grid-cols-2 gap-1">
              <div className="py-1 bg-yellow-400 text-black font-black text- text-center rounded">V = FICHA = SELECT</div>
              <div className="py-1 bg-white text-black font-black text- text-center rounded">ENTER = START</div>
            </div>
            <p className="text-center text-white/60 text-">USA LOS BOTONES NATIVOS DEL EMULADOR - ESOS SI PESCAN EN CELU</p>
          </div>
        </div>

        <p className="text-white/40 text- mt-2 text-center px-2">
          En celular usa el pad que aparece: <b className="text-yellow-400">SELECT = Ficha</b>, <b className="text-white">START = Start</b>, X = Acelera, Z = Turbo
        </p>
      </section>
    </>
  );
}