"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "420px", 
  pcHeight = "600px" 
}: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
    window.scrollTo(0, 0);

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = false;
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
        .game-wrapper {
          position: relative;
          width: 100%;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        #game {
          position: relative!important;
          width: 100%!important;
          height: 100%!important;
        }
        #game canvas {
          width: auto!important;
          height: 100%!important;
          max-width: 100%!important;
          object-fit: contain!important;
        }
        /* ESTO MATA LA BARRA QUE TE TAPA LA PAGINA */
        #game > div[style*="position: fixed"],
        #game div[style*="position: fixed; bottom"] {
          position: absolute!important;
          bottom: 0!important;
          left: 0!important;
          width: 100%!important;
          z-index: 5!important;
        }
        /* Si quieres ocultarla completa, descomenta esto: */
        /* .ejs_menu_bar, .ejs_control_bar { display: none!important; } */

        @media (max-width: 768px) { .game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { .game-wrapper { height: ${pcHeight}!important; } }
      `}</style>
      <div className="game-wrapper">
        <div id="game" />
      </div>
    </>
  );
}
