"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "550px", 
  pcHeight = "750px" 
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
    s.onload = () => {
      // Mata la barra de abajo que te tapa todo
      const killBar = setInterval(() => {
        document.querySelectorAll('div').forEach((el: any) => {
          if (el.style?.position === 'fixed' && el.style?.bottom === '0px') {
            if (el.innerHTML.includes('0:02') || el.innerHTML.includes('Save') || el.querySelector('input[type="range"]')) {
              el.style.display = 'none';
            }
          }
        });
        // Mata Fast y Slow
        document.querySelectorAll('button').forEach((b: any) => {
          if (b.textContent === 'Fast' || b.textContent === 'Slow') b.style.display = 'none';
        });
      }, 300);
      setTimeout(() => clearInterval(killBar), 8000);

      // Anti-scroll
      setTimeout(() => window.scrollTo(0, 0), 100);
      setTimeout(() => window.scrollTo(0, 0), 600);
    };
    document.body.appendChild(s);

    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        .game-wrapper { position: relative; width: 100%; background: #000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
        #game { position: relative!important; width: 100%!important; height: 100%!important; }
        #game canvas {
          width: 100%!important;
          height: 100%!important;
          object-fit: fill!important; /* estirado como querías */
        }
        @media (max-width: 768px) { .game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { .game-wrapper { height: ${pcHeight}!important; } }
      `}</style>
      <div className="game-wrapper">
        <div id="game" />
      </div>
    </>
  );
}