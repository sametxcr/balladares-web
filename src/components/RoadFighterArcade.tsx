"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "420px", 
  pcHeight = "600px" 
}: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true; // <--- CARGA SOLO, SIN BOTON
    (window as any).EJS_fullscreenOnLoaded = false;
    (window as any).EJS_virtualGamepad = true;
    (window as any).EJS_Buttons = { playPause: false, restart: false, mute: false, settings: false, fullscreen: false, saveState: false, loadState: false, quickSave: false, quickLoad: false };

    // Anti-scroll para que no te baje al juego en el celu
    (window as any).EJS_onGameStart = () => {
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as any }), 100);
    };

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);

    // Por si acaso, fuerza que parta arriba
    setTimeout(() => window.scrollTo(0,0), 300);
    setTimeout(() => window.scrollTo(0,0), 800);

    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        .game-wrapper { position: relative; width: 100%; background: #000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
        #game { position: relative!important; width: 100%!important; height: 100%!important; }
        #game canvas { width: auto!important; height: 100%!important; max-width: 100%!important; object-fit: contain!important; }
        #game > div[style*="fixed"] { position: absolute!important; bottom:0!important; left:0!important; width:100%!important; }
        @media (max-width: 768px) { .game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { .game-wrapper { height: ${pcHeight}!important; } }
      `}</style>
      <div className="game-wrapper">
        <div id="game" />
      </div>
    </>
  );
}