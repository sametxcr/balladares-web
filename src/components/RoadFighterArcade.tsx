"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "500px", 
  pcHeight = "650px" 
}: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
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

    // Pa que no te mande pa abajo
    setTimeout(() => window.scrollTo(0,0), 200);

    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        #game { width: 100%!important; background:#000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: fill!important; }

        /* MATA LA BARRA QUE TE SALE ABAJO EN EL CELU */
        body > div[style*="position: fixed"][style*="bottom: 0"] {
          display: none!important;
        }
        div[style*="background: rgb(38, 38, 38)"],
        div[style*="background: rgb(34, 34, 38)"] {
          display: none!important;
        }

        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>
      <div id="game" />
    </>
  );
}