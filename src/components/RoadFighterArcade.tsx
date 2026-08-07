"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "500px", pcHeight = "650px" }: { height?: string; pcHeight?: string; }) {
  useEffect(() => {
    // 1. Bloquea que cualquier wea te haga scroll al juego
    const originalScroll = HTMLElement.prototype.scrollIntoView;
    // @ts-ignore
    HTMLElement.prototype.scrollIntoView = function() {};

    window.scrollTo(0,0);

    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "nes";
    (window as any).EJS_gameUrl = "/roms/RoadFighterJapan.nes";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = false;
    (window as any).EJS_fullscreenOnLoaded = false;
    (window as any).EJS_virtualGamepad = true;

    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    s.onload = () => {
      // Devuelve el scroll normal después de 2 seg y te deja arriba
      setTimeout(() => {
        HTMLElement.prototype.scrollIntoView = originalScroll;
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
      }, 1500);
    };
    document.body.appendChild(s);

    return () => {
      HTMLElement.prototype.scrollIntoView = originalScroll;
      if (document.body.contains(s)) document.body.removeChild(s);
    };
  }, []);

  return (
    <>
      <style>{`
        #game { width:100%!important; background:#000; overflow:hidden; position:relative; z-index:1; }
        #game canvas { width:100%!important; height:100%!important; object-fit:fill!important; }
        /* mata la barra flotante */
        body > div[style*="position: fixed"][style*="bottom: 0"] { display:none!important; }
        @media (max-width: 768px) { #game { height: ${height}!important; } }
        @media (min-width: 769px) { #game { height: ${pcHeight}!important; } }
      `}</style>
      <div id="game" />
    </>
  );
}