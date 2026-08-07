"use client";
import { useEffect, useState } from "react";

export default function RoadFighterArcade({ height = "h- md:h-" }: { height?: string }){
  const [failed, setFailed] = useState(false);
  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "fbneo";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    const s = document.createElement("script");
    s.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    s.onerror = () => setFailed(true);
    document.body.appendChild(s);
    return ()=>{ if(document.body.contains(s)) document.body.removeChild(s); };
  },[]);

  return (
    <section id="juego" className="bg-black py-6 px-0 w-full flex flex-col items-center">
      <h2 className="text-white font-black italic text-3xl mb-1 px-4">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
      <p className="text-white/40 text-xs mb-3">Original 1984 Konami</p>

      {/* AQUI ESTA EL CAMBIO - ANCHO COMPLETO */}
      <div className="w-full px-2 md:max-w- mx-auto border-2 border-white bg-black" style={{boxShadow:"4px 4px 0px #dc2626"}}>
        <div id="game" className={`w-full ${height}`} />
      </div>
    </section>
  )
}