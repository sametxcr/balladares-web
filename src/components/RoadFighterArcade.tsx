"use client";
import { useEffect } from "react";

export default function RoadFighterArcade() {
  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameName = "RoadFighterJapan";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_volume = 0.5;

    // ESTO HACE QUE TUS BOTONES PESCAN
    (window as any).EJS_virtualGamepad = true;
    (window as any).EJS_mobileControls = true;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        #game { width: 100%!important; max-width: 480px; aspect-ratio: 256/240; margin: 0 auto; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: contain!important; image-rendering: pixelated; }
      `}</style>
      <section className="bg-black w-full flex flex-col items-center py-4">
        <div id="game" className="w-full bg-black border-y-2 border-white" />
        <p className="text-white/40 text- mt-2">Si ves el juego, ya está. Si da Network Error es porque no subiste el.nes con git add -f</p>
      </section>
    </>
  );
}