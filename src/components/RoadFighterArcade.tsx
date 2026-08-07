"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "450px", 
  pcHeight = "600px" 
}: { 
  height?: string; 
  pcHeight?: string; 
}) {
  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_virtualGamepad = true;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        #game {
          width: 100%!important;
          background: #000;
          display: flex!important;
          justify-content: center!important;
          align-items: center!important;
          overflow: hidden;
          margin: 0 auto;
        }
        /* El juego siempre centrado y sin estirar */
        #game canvas {
          width: auto!important;
          height: 100%!important;
          max-width: 100%!important;
          object-fit: contain!important;
        }
        /* Achicar la cruceta gigante que te sale en la foto */
        .ejs_virtualGamepad {
          transform: scale(0.75);
          transform-origin: bottom center;
        }
        @media (max-width: 768px) {
          #game { height: ${height}!important; }
        }
        @media (min-width: 769px) {
          #game { height: ${pcHeight}!important; max-width: 800px; }
        }
      `}</style>
      <div id="game" className="border-y border-red-600" />
    </>
  );
}