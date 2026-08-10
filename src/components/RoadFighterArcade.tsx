"use client";
import { useEffect, useState } from "react";

export default function RoadFighterArcade({ height = "500px", pcHeight = "650px" }: { height?: string; pcHeight?: string; }) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    // Bloquea scroll del emulador
    const orig = HTMLElement.prototype.scrollIntoView;
    // @ts-ignore
    HTMLElement.prototype.scrollIntoView = function() {};

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_fullscreenOnLoaded = false;
    (window as any).EJS_virtualGamepad = true;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);

    return () => {
      HTMLElement.prototype.scrollIntoView = orig;
      if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, [started]);

  return (
    <>
      <style>{`
        #game-wrapper { position:relative; width:100%; background:#000; overflow:hidden; z-index:1; display:flex; align-items:center; justify-content:center; }
        #game { width:100%!important; height:100%!important; background:#000; overflow:hidden; }
        #game canvas { width:100%!important; height:100%!important; object-fit:fill!important; }
        body > div[style*="position: fixed"][style*="bottom: 0"] { display:none!important; }
        @media (max-width: 768px) { #game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { #game-wrapper { height: ${pcHeight}!important; } }
      `}</style>

      <div id="game-wrapper">
        {!started? (
          <div className="bg-black w-full h-full flex flex-col items-center justify-center gap-4">
            <p className="text-white/60 text-sm tracking-widest">ARCADE MODE</p>
            <button
              onClick={() => setStarted(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-black text-xl px-10 py-4 rounded-full transition-all hover:scale-105"
            >
              ▶ JUGAR AHORA
            </button>
            <p className="text-white/40 text-xs">Road Fighter - Balladares Motors</p>
          </div>
        ) : (
          <div id="game" />
        )}
      </div>
    </>
  );
}