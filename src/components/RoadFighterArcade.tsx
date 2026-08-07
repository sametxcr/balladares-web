"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ 
  height = "580px", 
  pcHeight = "750px" 
}: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
    // 1. Observador que mata la barra en cuanto se crea
    const observer = new MutationObserver(() => {
      document.querySelectorAll('div').forEach((el: any) => {
        const style = el.getAttribute('style') || '';
        // Es la barra de abajo que marcaste en rojo
        if (style.includes('position: fixed') && style.includes('bottom: 0')) {
          el.remove();
        }
        // Mata Fast y Slow
        if (el.textContent === 'Fast' || el.textContent === 'Slow') {
          el.style.display = 'none';
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_fullscreenOnLoaded = false;
    (window as any).EJS_virtualGamepad = true;
    (window as any).EJS_Buttons = {
      playPause: false, restart: false, mute: false, settings: false,
      fullscreen: false, saveState: false, loadState: false,
      quickSave: false, quickLoad: false, screenRecord: false, 
      gamepad: false, cheat: false, volume: false, saveSavFiles: false, loadSavFiles: false
    };

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);

    // Que no te mande al juego
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'instant' as any }), 200);

    return () => {
      observer.disconnect();
      if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, []);

  return (
    <>
      <style>{`
        .game-wrapper { position: relative; width: 100%; background: #000; display:flex; justify-content:center; align-items:center; overflow:hidden; }
        #game { position: relative!important; width: 100%!important; height: 100%!important; }
        #game canvas { width: 100%!important; height: 100%!important; object-fit: fill!important; }
        @media (max-width: 768px) { .game-wrapper { height: ${height}!important; } }
        @media (min-width: 769px) { .game-wrapper { height: ${pcHeight}!important; } }
      `}</style>
      <div className="game-wrapper">
        <div id="game" />
      </div>
    </>
  );
}