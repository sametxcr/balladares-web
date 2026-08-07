"use client";
import { useEffect } from "react";

export default function RoadFighterArcade(){
  useEffect(()=>{
    (window as any).EJS_player = "#game";
    (window as any).EJS_core = "mame2003";
    (window as any).EJS_gameName = "roadf";
    (window as any).EJS_gameUrl = "/roms/roadf.zip";
    (window as any).EJS_pathtodata = "https://cdn.emulatorjs.org/stable/data/";
    (window as any).EJS_startOnLoaded = true;
    (window as any).EJS_backgroundColor = "#000";
    const script = document.createElement("script");
    script.src = "https://cdn.emulatorjs.org/stable/data/loader.js";
    document.body.appendChild(script);
    return () => { if(document.body.contains(script)) document.body.removeChild(script); };
  },[]);

  return (
    <section id="juego" className="bg-black py-10 px-4 flex flex-col items-center">
      <h2 className="text-white font-black italic text-3xl mb-1">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
      <p className="text-white/40 text-xs mb-4">Original 1984 Konami</p>

      {/* ACHICADO A LA MITAD - antes era max-w- */}
      <div className="w-full max-w- border-2 border-white bg-black" style={{boxShadow:"4px 4px 0px #dc2626"}}>
        <div id="game" className="w-full h-" />
      </div>

      <p className="text-white/40 text- mt-2">ENTER = Moneda | 1 = Start</p>
    </section>
  )
}