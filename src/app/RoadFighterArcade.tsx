"use client";
import { useEffect } from "react";

export default function RoadFighterArcade(){
  useEffect(()=>{
    // Configuración MAME para roadf.zip
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

    return () => {
      if(document.body.contains(script)) document.body.removeChild(script);
    };
  },[]);

  return (
    <section id="juego" className="bg-black py-16 px-4 flex flex-col items-center">
      <h2 className="text-white font-black italic text-3xl md:text-5xl mb-2">ROAD FIGHTER <span className="text-red-600">ARCADE</span></h2>
      <p className="text-white/50 text-sm mb-6">Original 1984 Konami - Emulado en tu página</p>

      <div className="w-full max-w- border-4 border-white bg-black relative" style={{boxShadow:"8px 8px 0px #dc2626"}}>
        <div id="game" className="w-full aspect-[4/3]" />
      </div>

      <div className="mt-4 text-white/60 text-xs text-center leading-relaxed">
        <span className="text-white font-bold">CONTROLES:</span> ENTER = Moneda / 1 = Start / Flechas = Manejar / CTRL = Acelerar<br/>
        En celular toca la pantalla para mostrar los botones.
      </div>
    </section>
  )
}