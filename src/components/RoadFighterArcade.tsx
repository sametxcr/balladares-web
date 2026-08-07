"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "450px", 
  pcHeight = "500px" 
}: { 
  height?: string; 
  pcHeight?: string; 
}) {
  useEffect(() => {
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameName = "RoadFighterJapan";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
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
        #game { 
          width: 100%!important; 
          background: black;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        #game canvas, #game > div, #game > div > div {
          width: auto!important;
          height: 100%!important;
          aspect-ratio: 256 / 240;
          max-width: 100%!important;
          object-fit: contain!important;
        }
        @media (max-width: 768px) {
          #game { height: ${height}!important; }
        }
        @media (min-width: 769px) {
          #game { height: ${pcHeight}!important; }
        }
      `}</style>
      <section className="bg-black w-full flex flex-col items-center">
        <div id="game" className="w-full" />
      </section>
    </>
  );
}