"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "420px", 
  pcHeight = "600px" 
}: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
    // Que siempre parta arriba
    window.scrollTo(0, 0);

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = false; // <-- ESTE ERA EL QUE TE BAJABA SOLO
    (window as any).EJS_fullscreenOnLoaded = false;
    (window as any).EJS_virtualGamepad = true;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        .game-wrapper { position: relative; width: 100%; background: #000; display: flex; justify-content: center; overflow: hidden; }
        #game { width: 100%!important; height: 100%!important; }
        #game canvas { width: auto!important; height: 100%!important; max-width: 100%!important; object-fit: contain!important; }
        @media (max-width: 768px) { .game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { .game-wrapper { height: ${pcHeight}!important; } }
      `}</style>
      <div className="game-wrapper">
        <div id="game" />
      </div>
    </>
  );
}