"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "550px",  // más alto en celu
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
      // Saca los botones Fast y Slow después que carga
      const interval = setInterval(() => {
        document.querySelectorAll("button, div").forEach(el => {
          const t = el.textContent?.trim();
          if (t === "Fast" || t === "Slow") (el as HTMLElement).style.display = "none";
        });
      }, 500);
      setTimeout(() => clearInterval(interval), 5000);
    };
    document.body.appendChild(s);
    setTimeout(() => window.scrollTo(0,0), 500);

    return () => { if (document.body.contains(s)) document.body.removeChild(s); };
  }, []);

  return (
    <>
      <style>{`
        .game-wrapper { position: relative; width: 100%; background: #000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
        #game { position: relative!important; width: 100%!important; height: 100%!important; }
        
        /* ESTIRA EL JUEGO DENTRO DEL EMULADOR */
        #game canvas {
          width: 100%!important;
          height: 100%!important;
          max-width: 100%!important;
          object-fit: fill!important; /* lo estira a todo el cuadro rojo */
          transform: scale(1.15); /* si lo quieres mas grande aún, sube a 1.25 */
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