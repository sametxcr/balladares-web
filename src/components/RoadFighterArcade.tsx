"use client";
import { useEffect } from "react";

export default function RoadFighterArcade({ height = "900px", pcHeight = "500px" }: { height?: string, pcHeight?: string }){
  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(s);
    return ()=>{ if(document.body.contains(s)) document.body.removeChild(s); };
  },[]);

  return (
    <>
      <style>{`
        #game { width: 100% !important; }
        #game canvas, #game > div { width: 100% !important; height: 100% !important; object-fit: fill !important; }
        @media (max-width: 768px) {
          #game { height: ${height} !important; }
        }
        @media (min-width: 769px) {
          #game { height: ${pcHeight} !important; }
        }
      `}</style>

      <section id="juego" className="bg-black py-6 w-screen relative left-1/2 -translate-x-1/2 flex flex-col items-center">
        <h2 className="text-white font-black italic text-3xl mb-1">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
        <p className="text-white/40 text-xs mb-3">Original 1984 Konami</p>

        {/* ANCHO COMPLETO REAL */}
        <div className="w-full border-y-2 md:border-2 border-white bg-black" style={{boxShadow:"0px 4px 0px #dc2626"}}>
          <div id="game" className="w-full" />
        </div>
      </section>
    </>
  )
}